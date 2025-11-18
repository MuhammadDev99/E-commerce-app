import { signal } from "@preact/signals-react";
import type { Product } from "../types";
import { showMessage } from "./messageSignal";

const CART_LOCAL_STORAGE_KEY = "cart";

function getInitialCart(): Product[] {
    const savedCart = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
}

export const cart = signal<Product[]>(getInitialCart());

function addToCart(product: Product) {
    const existingProduct = cart.value.find((item) => item.id === product.id);

    if (existingProduct) {
        showMessage({
            title: 'Already in Cart',
            content: `${product.title} is already in your cart.`,
            type: 'warning',
            duration: 3000
        });
    } else {
        cart.value = [...cart.value, product];
        localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(cart.value));
        showMessage({
            title: 'Success!',
            content: `${product.title} has been added to your cart.`,
            type: 'success',
            duration: 3000
        });
    }
}

function removeFromCart(productId: number) {
    cart.value = cart.value.filter((item) => item.id !== productId);
    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(cart.value));
    showMessage({
        title: 'Item Removed',
        content: `The item has been removed from your cart.`,
        type: 'success',
        duration: 2000
    });
}

function clearCart() {
    cart.value = [];
    localStorage.removeItem(CART_LOCAL_STORAGE_KEY);
    showMessage({
        title: 'Cart Cleared',
        content: `Your cart is now empty.`,
        type: 'success',
        duration: 2000
    });
}

export { addToCart, removeFromCart, clearCart };