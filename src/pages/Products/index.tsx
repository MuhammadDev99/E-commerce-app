import { signal } from "@preact/signals-react"
import { API_BASE } from "../../constants"
import styles from "./style.module.css"
import type { Product } from "../../types"
import { useEffect } from "react"
import ProductItem from "./ProductItem"
import { getProducts } from "../../utils"
const products = signal<Product[]>([])

function Products() {
    /* getProducts().then((data) => {
        products.value = data
    }) */
    useEffect(() => {
        getProducts().then((data) => {
            products.value = data
        })
    }, [])
    return (
        <>
            <div>
                <div className={styles.products}>
                    {products.value.map((product) => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Products
