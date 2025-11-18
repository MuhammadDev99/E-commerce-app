import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import styles from "../../components/AuthForm/style.module.css";
import { API_BASE } from "../../constants";
import { login } from "../../utils";
interface LoginData {
    email: string;
    password: string;
}


export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const { response, error } = await login(formData.get("email") as string, formData.get("password") as string);
        setError(error);
        setLoading(false);
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