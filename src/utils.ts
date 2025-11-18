import { API_BASE, LOCAL_STORAGE_USER_KEY } from "./constants"
import type { Product, User } from "./types"

async function getProducts(): Promise<Product[]> {
    const LOCAL_STORAGE_KEY = "products"
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (data) {
        return JSON.parse(data) as Product[]
    }
    const response = await fetch(`${API_BASE}/products`)
    const products = await response.json()
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products))
    return products as Product[]
}

function addToCart(product: Product) {

}

function getUserLocalStorage(): User | null {
    const user = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (user) {
        return JSON.parse(user) as User;
    }
    return null;
}



export { getProducts, addToCart, getUserLocalStorage }