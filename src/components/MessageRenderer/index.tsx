import { messagesSignal } from "../../signals/messageSignal";
import Message from "../Message";
import styles from "./style.module.css"; // Applies the styles above

function MessageRenderer() {
    const messages = messagesSignal.value;

    if (!messages.length) {
        return null;
    }

    return (
        // This div gets the .rendererContainer styles
        <div className={styles.rendererContainer}>
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    );
}

export default MessageRenderer;