import { signal } from "@preact/signals-react";
import styles from "./style.module.css";
import { LOCAL_STORAGE_USER_KEY } from "../../constants";
import { useEffect } from "react";
import type { User } from "../../types";
import { showMessage } from "../../signals/messageSignal";

// --- State Management with Signals ---
const userFullName = signal<string>("");
const isEditingName = signal<boolean>(false);
const nameInputValue = signal<string>("");
const newPassword = signal<string>("");
const confirmPassword = signal<string>("");
// --- NEW: Signal to track password match state ---
const passwordsDoNotMatch = signal<boolean>(false);

// --- Data Fetching Logic ---
async function getUserFullName() {
    const userRaw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    if (user && user.fullName) {
        userFullName.value = user.fullName;
        nameInputValue.value = user.fullName;
    }
}

// --- Component Function ---
function Dashboard() {
    useEffect(() => {
        getUserFullName();
    }, []);

    // --- Event Handlers ---
    const handleEditNameClick = () => {
        isEditingName.value = true;
    };

    const handleSaveNameClick = () => {
        if (nameInputValue.value.trim()) {
            userFullName.value = nameInputValue.value;
            const userRaw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            const user = userRaw ? (JSON.parse(userRaw) as User) : { fullName: "" };
            user.fullName = nameInputValue.value;
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));

            showMessage({
                title: 'Profile Updated',
                content: 'Your name has been successfully updated.',
                type: 'success',
                duration: 3000
            });
        }
        isEditingName.value = false;
    };

    // --- NEW: Handler for real-time validation on the confirm password input ---
    const handleConfirmPasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
        confirmPassword.value = (e.target as HTMLInputElement).value;
        // Update the validation state in real-time
        passwordsDoNotMatch.value = newPassword.value !== confirmPassword.value;
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Final check on submit
        if (newPassword.value !== confirmPassword.value) {
            showMessage({
                title: 'Error',
                content: 'Passwords do not match. Please try again.',
                type: 'error',
                duration: 3000
            });
            passwordsDoNotMatch.value = true; // Ensure error state is set
            return;
        }
        if (newPassword.value.length < 6) {
            showMessage({
                title: 'Error',
                content: 'Password must be at least 6 characters long.',
                type: 'error',
                duration: 3000
            });
            return;
        }

        console.log("Password changed to:", newPassword.value);
        showMessage({
            title: 'Password Changed',
            content: 'Your password has been successfully updated.',
            type: 'success',
            duration: 3000
        });

        // --- MODIFIED: Reset form and validation state ---
        newPassword.value = "";
        confirmPassword.value = "";
        passwordsDoNotMatch.value = false;
    };

    const handleLogout = () => {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        window.location.href = "/login";
    };

    return (
        <main className={styles.dashboard}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Welcome back, {userFullName}</h1>
                    <p>Manage your profile and security settings.</p>
                </header>

                <div className={styles.cardsContainer}>
                    <section className={styles.card}>
                        <h2>Profile Settings</h2>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <div className={styles.nameEditContainer}>
                                {isEditingName.value ? (
                                    <>
                                        <input
                                            type="text"
                                            value={nameInputValue.value}
                                            onInput={(e) => (nameInputValue.value = (e.target as HTMLInputElement).value)}
                                            className={styles.input}
                                        />
                                        <button onClick={handleSaveNameClick} className={styles.buttonPrimary}>
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>{userFullName}</span>
                                        <button onClick={handleEditNameClick} className={styles.buttonSecondary}>
                                            Change Name
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <h2>Security Settings</h2>
                        <form onSubmit={handlePasswordSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword.value}
                                    onInput={(e) => (newPassword.value = (e.target as HTMLInputElement).value)}
                                    placeholder="Enter new password"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                {/* --- MODIFIED: Added conditional error class --- */}
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword.value}
                                    onInput={handleConfirmPasswordInput} // Use the new handler
                                    placeholder="Confirm new password"
                                    className={`${styles.input} ${passwordsDoNotMatch.value ? styles.inputError : ""}`}
                                    required
                                />
                                {/* --- NEW: Conditionally render an error message --- */}
                                {passwordsDoNotMatch.value && confirmPassword.value && (
                                    <p className={styles.errorMessage}>Passwords do not match.</p>
                                )}
                            </div>
                            <button type="submit" className={styles.buttonPrimary}>
                                Change Password
                            </button>
                        </form>
                    </section>

                    <section className={styles.card}>
                        <h2>Actions</h2>
                        <button onClick={handleLogout} className={styles.buttonDanger}>
                            Logout
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;