import { cart, removeFromCart, clearCart } from "../../signals/cartSignal";
import styles from "./style.module.css";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
    const productsInCart = cart.value;

    const calculateSubtotal = () => {
        return productsInCart.reduce((total, product) => total + product.price, 0).toFixed(2);
    };

    if (productsInCart.length === 0) {
        return (
            <div className={styles.cartContainer}>
                <div className={styles.emptyCart}>
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className={styles.ctaButton}>
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            <div className={styles.cartHeader}>
                <h1>Your Shopping Cart ({productsInCart.length})</h1>
                <button onClick={clearCart} className={styles.clearCartButton}>
                    Clear Cart
                </button>
            </div>

            <div className={styles.cartLayout}>
                <div className={styles.cartItems}>
                    {productsInCart.map((product) => (
                        <div key={product.id} className={styles.cartItem}>
                            <Link to={`/products/${product.id}`}>
                                <img src={product.image} alt={product.title} className={styles.itemImage} />
                            </Link>
                            <div className={styles.itemDetails}>
                                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                                    <h3 className={styles.itemTitle}>{product.title}</h3>
                                </Link>
                                <p className={styles.itemPrice}>${product.price.toFixed(2)}</p>
                                <button onClick={() => removeFromCart(product.id)} className={styles.removeItemButton}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.cartSummary}>
                    <h2>Order Summary</h2>
                    <div className={styles.summaryLine}>
                        <span>Subtotal</span>
                        <span>${calculateSubtotal()}</span>
                    </div>
                    <div className={styles.summaryLine}>
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className={`${styles.summaryLine} ${styles.total}`}>
                        <span>Total</span>
                        <span>${calculateSubtotal()}</span>
                    </div>
                    <button onClick={() => { navigate("/checkout"); }} className={styles.checkoutButton}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;