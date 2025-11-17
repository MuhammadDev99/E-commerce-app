import { signal } from "@preact/signals-react";
import styles from "./style.module.css";
import { useParams } from 'react-router-dom';
import type { Product } from "../../types";
import { addToCart, getProducts } from "../../utils";
import { useEffect } from "react";
import Stars from "../Products/Stars";
import { showMessage } from "../../signals/messageSignal"; // Import showMessage

const products = signal<Product[]>([]);

function ProductDetail() {
    const { productId } = useParams();
    if (products.value.length === 0) {
        getProducts().then((data) => {
            products.value = data;
        });
    }
    useEffect(() => {
        getProducts().then((data) => {
            products.value = data;
        });
    }, []);

    const product: Product = products.value.find((product) => product.id === Number(productId)) as Product;

    if (!product) {
        return (
            <div className={styles.notFoundContainer}>
                <img className={styles.notFoundImage} src="/images/cat.png" alt="Not Found" />
                <p className={styles.notFoundText}>Product not found</p>
            </div>
        );
    }
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
        )
    }

    const handleAddToCart = () => {
        addToCart(product);
        showMessage({
            title: 'Success!',
            content: `${product.title} has been added to your cart.`,
            type: 'success',
            duration: 3000 // 3 seconds
        });
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.productDetailContainer}>
                <div className={styles.imageContainer}>
                    <img src={product.image} alt={product.title} className={styles.productImage} />
                </div>
                <div className={styles.detailsContainer}>
                    {titleJsx}
                    <div className={styles.ratingContainer}>
                        {product.discountPercentage > 0 && (
                            <p className={styles.discountBadge}>%{product.discountPercentage.toFixed(0)} OFF</p>
                        )}
                        <Stars stars={product.stars} />
                    </div>
                    <div className={styles.priceContainer}>
                        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                        <button onClick={handleAddToCart} className={styles.addToCartButton}>Add to Cart</button>
                    </div>
                    <p className={styles.productDescription}>{product.description}</p>
                </div>
            </div>

            <div className={styles.commentsSection}>
                <h2 className={styles.commentsTitle}>Customer Reviews</h2>
                {product.comments.length > 0 ? (
                    product.comments.map((comment, index) => (
                        <div key={index} className={styles.commentCard}>
                            <div className={styles.commentHeader}>
                                <Stars stars={comment.stars} />
                                <p className={styles.commentTitle}>{comment.title}</p>
                            </div>
                            <p className={styles.commentText}>{comment.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;