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
                <p>Have questions about our products? We'd love to hear from you!</p>
            </div>

            <div className={styles.contentWrapper}>
                {/* Left Side: Form */}
                <div className={styles.contactForm}>
                    <h2>Send a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="message">Your Message</label>
                            <textarea
                                id="message"
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="How can we help you?"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className={styles.submitButton}>Send Message</button>
                    </form>
                </div>

                {/* Right Side: Info */}
                <div className={styles.contactInfo}>
                    <h2>Contact Information</h2>
                    <p>
                        <strong>Address</strong>
                        123 Sparkle Street<br />
                        Brighton, UK
                    </p>
                    <p>
                        <strong>Email</strong>
                        <Link to="mailto:hello@sparkyshop.com">hello@sparkyshop.com</Link>
                    </p>
                    <p>
                        <strong>Phone</strong>
                        +44 123 456 7890
                    </p>
                    <p>
                        <strong>Business Hours</strong>
                        Mon - Fri: 9am - 6pm<br />
                        Sat: 10am - 4pm
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Contact;