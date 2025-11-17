import styles from "./style.module.css";
import type { AuthMode } from "../../types";
import { Link } from "react-router-dom"; // You'll need react-router-dom for this

interface AuthFormProps {
    mode: AuthMode;
    children: React.ReactNode;
}

function AuthForm({ mode, children }: AuthFormProps) {
    const isLogin = mode === 'login';
    const title = isLogin ? "Welcome Back!" : "Create an Account";
    const subtitle = isLogin ? "Please enter your details to sign in." : "Let's get you started.";
    const footerText = isLogin ? "Don't have an account?" : "Already have an account?";
    const footerLinkText = isLogin ? "Sign Up" : "Sign In";
    const footerLinkTo = isLogin ? "/register" : "/login";

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authHeader}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
                {children}
                <div className={styles.authFooter}>
                    <p>
                        {footerText}{" "}
                        <Link to={footerLinkTo} className={styles.link}>
                            {footerLinkText}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;