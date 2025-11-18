import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { LOCAL_STORAGE_USER_KEY, API_BASE } from "../../constants";
import type { User } from "../../types";
import { showMessage } from "../../signals/messageSignal";


async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: 'include', // ← this sends the httpOnly cookie automatically
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || response.statusText || 'An error occurred');
    }

    return response.json();
}

// --- Component Function ---
function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInputValue, setNameInputValue] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await fetchWithAuth(`${API_BASE}/me`);
                setUser(userData);
                setNameInputValue(userData.fullName);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                // Redirect to login if not authenticated
                window.location.href = "/login";
            }
        };
        fetchUser();
    }, []);

    const handleSaveNameClick = async () => {
        if (nameInputValue.trim() && user) {
            try {
                const updatedUser = await fetchWithAuth(`${API_BASE}/update-name`, {
                    method: 'PUT',
                    body: JSON.stringify({ fullName: nameInputValue }),
                });
                setUser(updatedUser.user);
                setIsEditingName(false);
                showMessage({
                    title: 'Profile Updated',
                    content: 'Your name has been successfully updated.',
                    type: 'success',
                    duration: 3000
                });
            } catch (error) {
                showMessage({
                    title: 'Error',
                    content: error.message,
                    type: 'error',
                    duration: 3000
                });
            }
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

        try {
            await fetchWithAuth(`${API_BASE}/update-password`, {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            showMessage({
                title: 'Password Changed',
                content: 'Your password has been successfully updated.',
                type: 'success',
                duration: 3000
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordsDoNotMatch(false);
        } catch (error) {
            showMessage({
                title: 'Error',
                content: error.message,
                type: 'error',
                duration: 3000
            });
        }
    };

    const handleLogout = async () => {
        try {
            await fetchWithAuth(`${API_BASE}/logout`, { method: 'POST' });
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <main className={styles.dashboard}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Welcome back, {user.fullName}</h1>
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
                                        <span>{user.fullName}</span>
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