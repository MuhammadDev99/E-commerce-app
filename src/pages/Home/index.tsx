import { useEffect } from 'react';
import { signal } from "@preact/signals-react";
import styles from "./style.module.css";
import { getProducts } from '../../utils';
import type { Product } from '../../types';
import ProductItem from '../Products/ProductItem';
import { SHOP_NAME } from '../../constants';
import { Link } from 'react-router-dom';

const featuredProducts = signal<Product[]>([]);

function Home() {
    useEffect(() => {
        getProducts().then((allProducts) => {
            // Display the first 4 products as featured
            featuredProducts.value = allProducts.slice(0, 4);
        });
    }, []);

    return (
        <div className={styles.homeContainer}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Welcome to {SHOP_NAME}</h1>
                    <p className={styles.heroSubtitle}>
                        Your destination for unique, high-quality products.
                    </p>
                    <Link to="/products" className={styles.heroButton}>
                        Explore Collection
                    </Link>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className={styles.featuredSection}>
                <h2 className={styles.featuredTitle}>Featured Products</h2>
                <div className={styles.featuredProductsGrid}>
                    {featuredProducts.value.map((product) => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;