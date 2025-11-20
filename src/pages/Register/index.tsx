import AuthForm from "../../components/AuthForm";
import styles from "../../components/AuthForm/style.module.css";
import { API_BASE } from "../../constants";
interface RegistrationData {
    fullName: string;
    email: string;
    password: string;
}
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../signals/messageSignal";
async function PostRegister(data: RegistrationData): Promise<boolean> {
    const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        /* console.log("Registration successful!"); */
        showMessage({ title: 'Success', content: 'Registration successful!', type: 'success', duration: 3000 });
    } else {
        /* console.error("Registration failed!"); */
        showMessage({ title: 'Error', content: 'Registration failed!', type: 'error', duration: 3000 });
    }
    return response.ok
}
function Register() {
    document.title = "Register";
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission for registration
        const formData = new FormData(event.currentTarget);
        const fullName = formData.get("fullName") as string | null ?? "";
        const email = formData.get("email") as string | null ?? "";
        const password = formData.get("password") as string | null ?? "";
        console.log("Registration attempt with: "
            + fullName + email + password, { fullName, email, password });
        const registerData: RegistrationData = {
            fullName: fullName || "",
            email: email || "",
            password: password || ""
        };
        PostRegister(registerData).then((success) => {
            if (success) {
                navigate("/login");
            }
        })


    };

    return (
        <AuthForm mode="register">
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="fullName" className={styles.label}>Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={styles.input}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className={styles.input}
                        placeholder="password"
                        minLength={8}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Create Account
                </button>
            </form>
        </AuthForm>
    );
}

export default Register;