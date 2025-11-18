import React, { useState } from 'react';
import styles from "./style.module.css";
import { showMessage } from '../../signals/messageSignal';
import { Link } from 'react-router-dom';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        showMessage({
            title: 'Message Sent!',
            content: "Thanks for reaching out. We'll get back to you soon.",
            type: 'success',
            duration: 4000
        });

        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className={styles.contactContainer}>
            <div className={styles.header}>
                <h1>Contact Us</h1>
                <p>Have questions? We'd love to hear from you!</p>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.contactForm}>
                    <h2>Send a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="message">Your Message</label>
                            <textarea id="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                        </div>
                        <button type="submit" className={styles.submitButton}>Submit</button>
                    </form>
                </div>

                <div className={styles.contactInfo}>
                    <h2>Contact Information</h2>
                    <p>
                        <strong>Address:</strong><br />
                        123 Sparkle Street, Brighton, UK
                    </p>
                    <p>
                        <strong>Email:</strong><br />
                        <Link to="mailto:hello@sparkyshop.com">hello@sparkyshop.com</Link>
                    </p>
                    <p>
                        <strong>Phone:</strong><br />
                        +44 123 456 7890
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Contact;