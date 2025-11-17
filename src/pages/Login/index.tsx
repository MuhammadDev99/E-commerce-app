import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import styles from "../../components/AuthForm/style.module.css";
import { API_BASE } from "../../constants";

interface LoginData {
    email: string;
    password: string;
}


export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState<string>("");

    // Get CSRF token on mount
    useEffect(() => {
        fetch(`${API_BASE}/csrf-token`, { credentials: "include" })
            .then(res => res.json())
            .then(data => setCsrfToken(data.csrfToken))
            .catch(err => console.error("CSRF fetch error:", err));
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const loginData: LoginData = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
                credentials: "include", // Essential: includes cookies
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful!", data);
                // User data is in response, token is in httpOnly cookie
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm mode="login">
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        placeholder="you@example.com"
                        required
                        disabled={loading}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className={styles.input}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>
        </AuthForm>
    );
}