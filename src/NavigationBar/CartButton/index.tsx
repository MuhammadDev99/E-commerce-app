import styles from "./style.module.css";

function CartButton({ itemsCount }: { itemsCount: number }) {
    return (
        <a className={styles.cartButton} href="/cart">
            <img className={styles.cartIcon} src="/images/shopping-cart.png" />
            <p className={styles.cartItemCount}>{itemsCount}</p>
        </a>
    );
}

export default CartButton;