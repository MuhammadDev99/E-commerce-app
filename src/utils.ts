import { API_BASE } from "./constants"
import type { product } from "./types"

async function getProducts(): Promise<product[]> {
    const LOCAL_STORAGE_KEY = "products"
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (data) {
        return JSON.parse(data) as product[]
    }
    const response = await fetch(`${API_BASE}/products`)
    const products = await response.json()
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products))
    return products as product[]
}

function addToCart(product: product) {

}

export { getProducts, addToCart }