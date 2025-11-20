import { API_BASE, LOCAL_STORAGE_USER_KEY } from "./constants";
import type { Product, User, ApiResponse } from "./types";
import { showMessage } from "./signals/messageSignal";

// Clean the Base URL for routing
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * A generic wrapper around the Fetch API to handle JSON parsing,
 * auth credentials, and standard error handling.
 * 
 * @template T - The expected return type of the data (e.g., User, Product[])
 */
async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            credentials: 'include', // Essential for HTTP-Only cookies
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
        });

        // Handle non-2xx responses (400, 401, 500, etc.)
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || response.statusText || 'An unexpected error occurred';
            return { data: null, error: errorMessage };
        }

        // Handle 204 No Content (e.g., logout)
        if (response.status === 204) {
            return { data: null, error: null };
        }

        const data = await response.json();
        return { data: data as T, error: null };

    } catch (err) {
        // Handle network errors (offline, DNS issues)
        const message = err instanceof Error ? err.message : 'Network request failed';
        return { data: null, error: message };
    }
}

/**
 * Products
 */
async function getProducts(): Promise<Product[]> {
    // Pro Tip: Don't cache dynamic product data in LocalStorage. 
    // It leads to stale prices/stock. rely on browser caching or React Query/SWR.
    const { data, error } = await apiClient<Product[]>('/products');

    if (error) {
        console.error("Failed to fetch products:", error);
        showMessage({ title: 'Connection Error', content: 'Could not load products.', type: 'error', duration: 4000 });
        return [];
    }

    return data || [];
}

/**
 * User & Auth
 */
function getUserLocalStorage(): User | null {
    try {
        const user = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        return user ? JSON.parse(user) as User : null;
    } catch (e) {
        console.error("Error parsing user from storage", e);
        return null;
    }
}

async function fetchUser(): Promise<User | null> {
    const { data, error } = await apiClient<User>('/me');
    if (error) {
        // Silent fail is often preferred for "check auth" calls, 
        // or you can log it for debugging.
        return null;
    }
    return data;
}

async function login(email: string, password: string): Promise<ApiResponse<{ user: User }>> {
    const result = await apiClient<{ user: User }>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (result.error) {
        showMessage({ title: 'Login Failed', content: result.error, type: 'error', duration: 3000 });
    } else if (result.data) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(result.data.user));
        showMessage({ title: 'Success', content: `Welcome back, ${result.data.user.fullName}`, type: 'success', duration: 3000 });
        window.location.href = `${ROUTER_BASE}/dashboard`;
    }

    return result;
}

async function logout() {
    const { error } = await apiClient('/logout', { method: 'POST' });

    if (error) {
        console.error("Logout warning:", error);
    }

    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    window.location.href = `${ROUTER_BASE}/login`;
}

async function updateFullName(fullName: string): Promise<User | null> {
    const { data, error } = await apiClient<{ user: User }>('/update-name', {
        method: 'PUT',
        body: JSON.stringify({ fullName })
    });

    if (error) {
        showMessage({ title: 'Update Failed', content: error, type: 'error', duration: 3000 });
        return null;
    }

    if (data) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        showMessage({ title: 'Profile Updated', content: 'Your name has been successfully updated.', type: 'success', duration: 3000 });
        return data.user;
    }
    return null;
}

async function updatePassword(currentPassword: string, newPassword: string): Promise<string | null> {
    // We expect a simple success message or empty object, not a User object
    const { error } = await apiClient('/update-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
    });

    if (error) {
        showMessage({ title: 'Error', content: error, type: 'error', duration: 3000 });
        return error;
    }

    showMessage({ title: 'Password Changed', content: 'Your password has been updated.', type: 'success', duration: 3000 });
    return null;
}

export {
    getProducts,
    getUserLocalStorage,
    logout,
    updateFullName,
    fetchUser,
    updatePassword,
    login
};