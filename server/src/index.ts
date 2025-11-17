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

dotenv.config({ path: path.join(__dirname, "../.env"), quiet: true });

// Initialize PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Type definitions
interface Comment { stars: number; title: string; comment: string; }
interface Product { id: number; title: string; description: string; price: number; stars: number; discountPercentage: number; comments: Comment[]; image: string; }
interface User { id: number; email: string; fullName: string; cartProducts: Product[]; }
interface UserDB { id: number; email: string; password_hash: string; full_name: string; cart_products: Product[]; }

const API_BASE = `http://localhost:${process.env.PORT || 3333}`;
const data = fs.readFileSync(path.join(__dirname, "../assets/products/products.json"), "utf-8");
const products: Product[] = (JSON.parse(data) as Product[]).map(p => ({ ...p, image: `${API_BASE}/assets/products/product-images/${p.id}.jpeg` }));

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// CSRF Protection
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: false, // Set true in production with HTTPS
        sameSite: 'lax'
    }
});

// JWT Middleware
const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.clearCookie("token");
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

// Routes
app.get("/products", (req, res) => res.json(products));

// Get CSRF Token (call this on page load)
app.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: (req as any).csrfToken() });
});

// Register
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
            httpOnly: true, // CRITICAL: Prevents XSS
            secure: false,  // Set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
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

// Login
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
            secure: false,
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

// Get current user
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

// Update cart
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

// Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});



const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));