import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { LOCAL_STORAGE_USER_KEY, API_BASE } from "../../constants";
import type { User } from "../../types";
import { showMessage } from "../../signals/messageSignal";
import { getUserLocalStorage, logout, updateFullName, fetchUser, updatePassword } from "../../utils";
import { signal } from "@preact/signals-react";


const user = signal<User | null>(getUserLocalStorage());
// --- Component Function ---
function Dashboard() {
    /* const [user, setUser] = useState<User | null>(null); */
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInputValue, setNameInputValue] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);

    useEffect(() => {
        setNameInputValue(user.value?.fullName || "");
    }, [user.value]);

    const handleSaveNameClick = async () => {
        if (nameInputValue.trim() && user) {
            const updatedUser = await updateFullName(nameInputValue);
            user.value = updatedUser;
            setIsEditingName(false);
        }
    };

    const handleConfirmPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setConfirmPassword(value);
        setPasswordsDoNotMatch(newPassword !== value);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setPasswordsDoNotMatch(true);
            showMessage({
                title: 'Error',
                content: 'Passwords do not match. Please try again.',
                type: 'error',
                duration: 3000
            });
            return;
        }
        const error = await updatePassword(currentPassword, newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordsDoNotMatch(false);
    };


    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <main className={styles.dashboard}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Welcome back, {user.value?.fullName}</h1>
                    <p>Manage your profile and security settings.</p>
                </header>

                <div className={styles.cardsContainer}>
                    <section className={styles.card}>
                        <h2>Profile Settings</h2>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <div className={styles.nameEditContainer}>
                                {isEditingName ? (
                                    <>
                                        <input
                                            type="text"
                                            value={nameInputValue}
                                            onChange={(e) => setNameInputValue(e.target.value)}
                                            className={styles.input}
                                        />
                                        <button onClick={handleSaveNameClick} className={styles.buttonPrimary}>
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>{user.value?.fullName}</span>
                                        <button onClick={() => setIsEditingName(true)} className={styles.buttonSecondary}>
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
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordInput}
                                    placeholder="Confirm new password"
                                    className={`${styles.input} ${passwordsDoNotMatch ? styles.inputError : ""}`}
                                    required
                                />
                                {passwordsDoNotMatch && confirmPassword && (
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
                        <button onClick={logout} className={styles.buttonDanger}>
                            Logout
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;