import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { clearCart } from '../../signals/cartSignal';
import { showMessage } from '../../signals/messageSignal';

function Checkout() {
    document.title = "Checkout";
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Pre-fill form with dummy data ---
    const [fullName, setFullName] = useState('John Doe');
    const [address, setAddress] = useState('123 Sparkle Street, Brighton, UK');
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242'); // Common test card number
    const [expiry, setExpiry] = useState('12/26');
    const [cvc, setCvc] = useState('123');

    const handleConfirmPurchase = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        setTimeout(() => {
            showMessage({
                title: 'Purchase Successful!',
                content: 'Your order has been placed and will be shipped soon. Thank you for shopping with us!',
                type: 'success',
                duration: 5000,
            });
            clearCart();
            navigate('/');
        }, 2000);
    };

    return (
        <div className={styles.checkoutContainer}>
            <div className={styles.checkoutCard}>
                <h1 className={styles.title}>Checkout</h1>
                <p className={styles.subtitle}>
                    This is a sample checkout page. <br />
                    <strong>Please do not enter real credit card information.</strong>
                </p>

                <form onSubmit={handleConfirmPurchase} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={isProcessing}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address">Shipping Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            disabled={isProcessing}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={`${styles.formGroup} ${styles.cardGroup}`}>
                            <label htmlFor="card">Card Number</label>
                            <input
                                type="text"
                                id="card"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                                disabled={isProcessing}
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.expiryGroup}`}>
                            <label htmlFor="expiry">Expiry</label>
                            <input
                                type="text"
                                id="expiry"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                required
                                disabled={isProcessing}
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.cvcGroup}`}>
                            <label htmlFor="cvc">CVC</label>
                            <input
                                type="text"
                                id="cvc"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                required
                                disabled={isProcessing}
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.confirmButton} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Confirm Purchase'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Checkout;