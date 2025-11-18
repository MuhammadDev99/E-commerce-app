import type { Product } from "../../../types";
import Stars from "../Stars";
import styles from "./style.module.css";
import { addToCart } from "../../../signals/cartSignal";

function ProductItem({ product }: { product: Product }) {
    const titleRegex = /'([^']*)'/;
    const match = product.title.match(titleRegex);

    let titleJsx;

    if (match) {
        const highlightedPart = match[1];
        const parts = product.title.split(match[0]);
        const restOfTheTitle = parts.join('');

        titleJsx = (
            <p className={styles.productTitle}>
                <span className={styles.highlightedWord}>{highlightedPart}</span>
                {restOfTheTitle}
            </p>
        );
    } else {
        titleJsx = <p className={styles.productTitle}>{product.title}</p>;
    }
    return (
        <div className={styles.product}>
            <a href={`/products/${product.id}`}>
                <div className={styles.productImageWrapper}>
                    <img className={styles.productImage} src={product.image} alt={product.title} />
                </div>
                <div className={styles.productInfo}>
                    {titleJsx}
                    <div className={styles.productRating}>
                        <Stars stars={product.stars} />
                        <p className={styles.productReviewCount}>{product.comments.length} {product.comments.length === 1 ? 'review' : 'reviews'}</p>
                    </div>
                    <div>
                        <p className={styles.productPrice}>{product.price}$</p>
                        <button onClick={(e) => { e.preventDefault(); addToCart(product); }} className={styles.addToCart}>Add to cart</button>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default ProductItem;