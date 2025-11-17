import { useEffect, useState } from "react";
import { removeMessage } from "../../signals/messageSignal"; // Import removeMessage
import styles from "./style.module.css";
import type { message } from "../../types";

function Message({ message }: { message: message }) {
    const [isClosing, setIsClosing] = useState(false);

    // This function now removes only this specific message from the global array
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            removeMessage(message.id); // Remove the message by its unique ID
        }, 300); // Duration must match the slideOutRight animation
    };

    useEffect(() => {
        const timer = setTimeout(handleClose, message.duration);
        return () => clearTimeout(timer);
    }, [message]); // Dependency array is correct

    const icon = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
    };

    const style = { '--duration': `${message.duration}ms` } as React.CSSProperties;
    const containerClasses = `${styles.messageContainer} ${styles[message.type]} ${isClosing ? styles.disappear : ''}`;

    return (
        <div className={containerClasses} style={style}>
            <span className={styles.icon}>{icon[message.type]}</span>
            <div className={styles.content}>
                <p className={styles.title}>{message.title}</p>
                <p className={styles.body}>{message.content}</p>
            </div>
            <button onClick={handleClose} className={styles.closeButton}>
                &times;
            </button>
        </div>
    );
}

export default Message;