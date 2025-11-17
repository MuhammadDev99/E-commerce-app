import { API_BASE } from "../constants";

interface LoginData {
    email: string;
    password: string;
}

interface RegistrationData {
    fullName: string;
    email: string;
    password: string;
}

export const authAPI = {
    async login(data: LoginData) {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    async register(data: RegistrationData) {
        const response = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    getToken() {
        return localStorage.getItem("token");
    },

    getUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};