// =========================================
// Product Management System
// API Service
// =========================================

class APIService {
    constructor(baseURL, storageKeys) {
        this.baseURL = baseURL;
        this.storageKeys = storageKeys;
    }

    /**
     * Get authorization token from localStorage
     */
    getToken() {
        return localStorage.getItem(this.storageKeys.TOKEN);
    }

    /**
     * Get user from localStorage
     */
    getUser() {
        const user = localStorage.getItem(this.storageKeys.USER);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Build headers with authentication
     */
    getHeaders(includeContentType = true) {
        const headers = {};
        
        if (includeContentType) {
            headers["Content-Type"] = "application/json";
        }

        const token = this.getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Handle API errors with consistent format
     */
    handleError(error, defaultMessage = "An error occurred") {
        console.error("API Error:", error);
        
        if (error.response?.status === 401) {
            // Token expired or invalid
            this.logout();
            return { success: false, message: "Session expired. Please login again." };
        }

        return {
            success: false,
            message: error.message || defaultMessage
        };
    }

    /**
     * Make API request
     */
    async request(method, endpoint, data = null, useFormData = false) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const options = {
                method,
                headers: useFormData ? {} : this.getHeaders()
            };

            if (useFormData && data) {
                // For file uploads with FormData
                const token = this.getToken();
                if (token) {
                    options.headers["Authorization"] = `Bearer ${token}`;
                }
                options.body = data; // FormData
            } else if (data && (method === "POST" || method === "PUT")) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || `Error: ${response.status}`,
                    status: response.status,
                    data: result.data
                };
            }

            return result;
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * GET request
     */
    get(endpoint) {
        return this.request("GET", endpoint);
    }

    /**
     * POST request
     */
    post(endpoint, data, useFormData = false) {
        return this.request("POST", endpoint, data, useFormData);
    }

    /**
     * PUT request
     */
    put(endpoint, data, useFormData = false) {
        return this.request("PUT", endpoint, data, useFormData);
    }

    /**
     * DELETE request
     */
    delete(endpoint) {
        return this.request("DELETE", endpoint);
    }

    /**
     * Store token and user in localStorage
     */
    setAuth(token, user) {
        localStorage.setItem(this.storageKeys.TOKEN, token);
        localStorage.setItem(this.storageKeys.USER, JSON.stringify(user));
    }

    /**
     * Clear authentication data
     */
    logout() {
        localStorage.clear();
        window.location.href = "/login.html";
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Check if user has specific role
     */
    hasRole(roleId) {
        const user = this.getUser();
        return user && user.role_id === roleId;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roleIds) {
        const user = this.getUser();
        return user && roleIds.includes(user.role_id);
    }
}

// Initialize API service
const API = new APIService(CONFIG.API.BASE_URL, CONFIG.STORAGE_KEYS);
