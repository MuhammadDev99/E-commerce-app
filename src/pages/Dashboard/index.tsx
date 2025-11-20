import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { LOCAL_STORAGE_USER_KEY } from "../../constants";
import type { User } from "../../types";
import { showMessage } from "../../signals/messageSignal";
import { getUserLocalStorage, logout, updateFullName, updatePassword } from "../../utils";
import { signal } from "@preact/signals-react";
// Import icons
import { User as UserIcon, Shield, LogOut, Edit2, Check, X } from "lucide-react";
const user = signal<User | null>(getUserLocalStorage());

function Dashboard() {
    document.title = "Dashboard";
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInputValue, setNameInputValue] = useState("");

    // Password states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setNameInputValue(user.value?.fullName || "");
    }, [user.value]);

    const handleSaveNameClick = async () => {
        if (nameInputValue.trim() && user.value) {
            setIsSaving(true);
            const updatedUser = await updateFullName(nameInputValue);
            if (updatedUser) {
                user.value = updatedUser;
                setIsEditingName(false);
            }
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setNameInputValue(user.value?.fullName || "");
        setIsEditingName(false);
    }

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
                content: 'Passwords do not match.',
                type: 'error',
                duration: 3000
            });
            return;
        }

        setIsSaving(true);
        await updatePassword(currentPassword, newPassword);
        setIsSaving(false);

        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordsDoNotMatch(false);
    };

    if (!user.value) {
        return <div className={styles.loadingContainer}>Loading profile...</div>;
    }

    return (
        <main className={styles.dashboard}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Welcome, {user.value.fullName.split(' ')[0]}</h1>
                    <p>Manage your account details and preferences.</p>
                </header>

                <div className={styles.cardsContainer}>

                    {/* --- Profile Section --- */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <UserIcon className={styles.cardIcon} size={24} />
                            <h2>Profile Information</h2>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            {isEditingName ? (
                                <div className={styles.nameEditForm}>
                                    <input
                                        type="text"
                                        value={nameInputValue}
                                        onChange={(e) => setNameInputValue(e.target.value)}
                                        className={styles.input}
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSaveNameClick}
                                        className={styles.buttonPrimary}
                                        title="Save"
                                        disabled={isSaving}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className={styles.buttonSecondary}
                                        title="Cancel"
                                        style={{ border: '1px solid #cbd5e0', color: '#718096' }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.nameDisplay}>
                                    <span className={styles.nameText}>{user.value.fullName}</span>
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        className={styles.buttonIcon}
                                        title="Edit Name"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label>Email Address</label>
                            <input
                                type="text"
                                value={user.value.email}
                                disabled
                                className={styles.input}
                                style={{ backgroundColor: '#edf2f7', cursor: 'not-allowed' }}
                            />
                        </div>
                    </section>

                    {/* --- Security Section --- */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Shield className={styles.cardIcon} size={24} />
                            <h2>Security Settings</h2>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
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
                                    placeholder="••••••••"
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
                                    placeholder="••••••••"
                                    className={`${styles.input} ${passwordsDoNotMatch ? styles.inputError : ""}`}
                                    required
                                />
                                {passwordsDoNotMatch && confirmPassword && (
                                    <p className={styles.errorMessage}>Passwords do not match.</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className={styles.buttonPrimary}
                                disabled={isSaving}
                            >
                                {isSaving ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </section>

                    {/* --- Danger Zone / Actions --- */}
                    <section className={styles.card} style={{ border: '1px solid #feb2b2' }}>
                        <div className={styles.cardHeader} style={{ borderBottomColor: '#fed7d7' }}>
                            <LogOut className={styles.cardIcon} style={{ color: '#c53030' }} size={24} />
                            <h2 style={{ color: '#c53030' }}>Sign Out</h2>
                        </div>
                        <p style={{ marginBottom: '1.5rem', color: '#718096', fontSize: '0.9rem' }}>
                            Sign out of your account on this device.
                        </p>
                        <button onClick={logout} className={styles.buttonDanger}>
                            Log Out
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;