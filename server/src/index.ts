import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import dotenv from "dotenv";
import https from "https";
import http from "http"; // Import HTTP for dev server

dotenv.config({ path: path.join(__dirname, "../.env"), quiet: true });

// 1. Determine Environment
const isProduction = process.env.NODE_ENV === "production";
const PORT = isProduction ? 443 : (process.env.PORT || 3333);

// 2. Initialize PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Type definitions
interface Comment { stars: number; title: string; comment: string; }
interface Product { id: number; title: string; description: string; price: number; stars: number; discountPercentage: number; comments: Comment[]; image: string; }
interface User { id: number; email: string; fullName: string; cartProducts: Product[]; }
interface UserDB { id: number; email: string; password_hash: string; full_name: string; cart_products: Product[]; }

// 3. Dynamic API Base URL
// If prod: https://muhammad.developer.li (no port needed for 443)
// If dev: http://localhost:3333
const API_BASE = isProduction
    ? "https://muhammad.developer.li"
    : `http://localhost:${PORT}`;

const data = fs.readFileSync(path.join(__dirname, "../assets/products/products.json"), "utf-8");
const products: Product[] = (JSON.parse(data) as Product[]).map(p => ({
    ...p,
    image: `${API_BASE}/assets/products/product-images/${p.id}.jpeg`
}));

const app = express();

// 4. Middleware
app.use(cors({
    origin: isProduction
        ? ["https://muhammad.developer.li"]
        : ["http://localhost:5173", "http://localhost:3333"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// 5. Dynamic CSRF Protection
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: isProduction, // False in Dev (HTTP), True in Prod (HTTPS)
        sameSite: 'lax'
    }
});

// JWT Middleware
const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Authentication required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.clearCookie("token");
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

// --- ROUTES ---

app.get("/products", (req, res) => res.json(products));

app.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: (req as any).csrfToken() });
});

app.post("/register", async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) return res.status(400).json({ error: "All fields required" });
        if (password.length < 6) return res.status(400).json({ error: "Password too short" });

        const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0) return res.status(409).json({ error: "User exists" });

        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, cart_products",
            [email, hash, fullName]
        );

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "24h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction, // Dynamic Secure Flag
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User created",
            user: { id: user.id, email: user.email, fullName: user.full_name, cartProducts: user.cart_products }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = result.rows[0] as UserDB;
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "24h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction, // Dynamic Secure Flag
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            user: { id: user.id, email: user.email, fullName: user.full_name, cartProducts: user.cart_products }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/me", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const result = await pool.query("SELECT id, email, full_name, cart_products FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const user = result.rows[0];
        res.json({ id: user.id, email: user.email, fullName: user.full_name, cartProducts: user.cart_products });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.put("/cart", authenticateToken, csrfProtection, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const { cartProducts } = req.body;

        const result = await pool.query(
            "UPDATE users SET cart_products = $1 WHERE id = $2 RETURNING id, email, full_name, cart_products",
            [JSON.stringify(cartProducts), userId]
        );

        const user = result.rows[0];
        res.json({ id: user.id, email: user.email, fullName: user.full_name, cartProducts: user.cart_products });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

app.put("/update-name", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const { fullName } = req.body;

        if (!fullName) return res.status(400).json({ error: "Full name is required" });

        const result = await pool.query(
            "UPDATE users SET full_name = $1 WHERE id = $2 RETURNING id, email, full_name, cart_products",
            [fullName, userId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const user = result.rows[0];
        res.json({
            message: "Name updated successfully",
            user: { id: user.id, email: user.email, fullName: user.full_name, cartProducts: user.cart_products }
        });
    } catch (error) {
        console.error("Update name error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.put("/update-password", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) return res.status(400).json({ error: "Current and new passwords are required" });
        if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters long" });

        const result = await pool.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: "Invalid current password" });

        const hash = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, userId]);

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 6. Start Server Logic
if (isProduction) {
    // PRODUCTION: HTTPS on Port 443
    try {
        const httpsOptions = {
            key: fs.readFileSync('/etc/ssl/private/private.key'),
            cert: fs.readFileSync('/etc/ssl/certificate.crt'),
            ca: fs.readFileSync('/etc/ssl/ca_bundle.crt')
        };

        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`🔒 Production Server running on HTTPS port ${PORT}`);
        });
    } catch (err) {
        console.error("FAILED TO START PRODUCTION SERVER: SSL Keys not found.", err);
    }
} else {
    // DEVELOPMENT: HTTP on Port 3333
    http.createServer(app).listen(PORT, () => {
        console.log(`🚧 Development Server running on HTTP port ${PORT}`);
    });
}