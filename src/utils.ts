import { API_BASE, LOCAL_STORAGE_USER_KEY } from "./constants"
import type { Product, User, PromiseResult } from "./types"
import { showMessage } from "./signals/messageSignal"
const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');


async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<PromiseResult> {
    const response = await fetch(url, {
        ...options,
        credentials: 'include', // ← this sends the httpOnly cookie automatically
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
            response,
            error: errorData.error || response.statusText || 'An error occurred'
        }
    }

    return {
        response,
        error: null
    };
}


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

function getUserLocalStorage(): User | null {
    const user = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (user) {
        return JSON.parse(user) as User;
    }
    return null;
}

async function logout() {
    const { error } = await fetchWithAuth(`${API_BASE}/logout`, { method: 'POST' });
    if (!error) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        window.location.href = `${BASE_URL}/login`;
    } else {
        console.error("Logout failed:", error);
        showMessage({ title: 'Error', content: error, type: 'error', duration: 3000 });
    }
}

async function updateFullName(fullName: string): Promise<User | null> {
    const { error, response } = await fetchWithAuth(`${API_BASE}/update-name`, { method: 'PUT', body: JSON.stringify({ fullName }) });
    if (error) {
        console.error("Update name failed:", error);
        showMessage({ title: 'Error', content: error, type: 'error', duration: 3000 });
        return null;
    }
    const updatedUser = (await response.json()).user;
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser));
    showMessage({ title: 'Profile Updated', content: 'Your name has been successfully updated.', type: 'success', duration: 3000 });
    return updatedUser as User;
}

async function fetchUser(): Promise<User | null> {
    const { error, response } = await fetchWithAuth(`${API_BASE}/me`);
    if (error) {
        console.error("Failed to fetch user:", error);
        return null;
    }
    return (await response.json()) as User;
}

// update password and returns an error if any
async function updatePassword(currentPassword: string, newPassword: string): Promise<string | null> {
    const { error } = await fetchWithAuth(`${API_BASE}/update-password`, { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) });
    if (!error) {
        showMessage({ title: 'Password Changed', content: 'Your password has been successfully updated.', type: 'success', duration: 3000 });
    } else {
        showMessage({ title: 'Error', content: error, type: 'error', duration: 3000 });
    }
    return error;
}

async function login(email: string, password: string): Promise<PromiseResult> {
    const { response, error } = await fetchWithAuth(`${API_BASE}/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
    if (error) {
        showMessage({ title: 'Error', content: error, type: 'error', duration: 3000 });
    } else {
        const user = (await response.json()).user;
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
        window.location.href = `${BASE_URL}/dashboard`;
        showMessage({ title: 'Success', content: `Welcome, ${user.fullName}`, type: 'success', duration: 3000 });
    }

    return { response, error }
}

export { getProducts, getUserLocalStorage, logout, updateFullName, fetchUser, updatePassword, login }