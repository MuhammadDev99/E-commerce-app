import styles from "./style.module.css";
import { Link } from "react-router-dom";
import { shoppingCart } from "../../assets/images";
function CartButton({ itemsCount }: { itemsCount: number }) {
    return (
        <Link className={styles.cartButton} to="/cart">
            <img className={styles.cartIcon} src={shoppingCart} />
            <p className={styles.cartItemCount}>{itemsCount}</p>
        </Link>
    );
}
export default CartButton;