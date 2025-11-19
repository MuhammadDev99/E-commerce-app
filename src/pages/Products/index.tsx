import { signal } from "@preact/signals-react"
import styles from "./style.module.css"
import type { Product } from "../../types"
import { useState } from "react" // Import useState
import ProductItem from "./ProductItem"
import { getProducts } from "../../utils"
import { search } from "../../assets/images"

// Keep the signal outside so state persists if you navigate away and back (optional)
const products = signal<Product[]>([])

function Products() {
    // Local state for the search input
    const [searchQuery, setSearchQuery] = useState("");

    if (products.value.length === 0) {
        getProducts().then((data) => {
            products.value = data
        })
    }

    // Create a filtered list based on the search query
    const filteredProducts = products.value.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <img src={search} alt="search" className={styles.searchIcon} />
                </div>

                <div className={styles.products}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductItem key={product.id} product={product} />
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            <p>No products found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Products