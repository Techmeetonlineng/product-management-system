// =========================================
// Product Management System
// Configuration
// =========================================

const CONFIG = {
    API: {
        BASE_URL: "http://localhost:5000/api",
        ENDPOINTS: {
            // Auth endpoints
            AUTH: {
                REGISTER: "/auth/register",
                LOGIN: "/auth/login",
                ME: "/auth/me"
            },
            // Product endpoints
            PRODUCTS: {
                LIST: "/products",
                GET: (id) => `/products/${id}`,
                CREATE: "/products",
                UPDATE: (id) => `/products/${id}`,
                DELETE: (id) => `/products/${id}`,
                APPROVE: (id) => `/products/${id}/approve`,
                REJECT: (id) => `/products/${id}/reject`
            },
            // Category endpoints
            CATEGORIES: {
                LIST: "/categories",
                GET: (id) => `/categories/${id}`,
                CREATE: "/categories",
                UPDATE: (id) => `/categories/${id}`,
                DELETE: (id) => `/categories/${id}`
            },
            // Vendor endpoints
            VENDORS: {
                LIST: "/vendors",
                GET: (id) => `/vendors/${id}`,
                STATS: "/vendors/stats",
                APPROVE: (id) => `/vendors/${id}/approve`,
                REJECT: (id) => `/vendors/${id}/reject`,
                SUSPEND: (id) => `/vendors/${id}/suspend`
            },
            // Dashboard endpoints
            DASHBOARD: {
                GET: "/dashboard"
            }
        }
    },
    ROLES: {
        ADMIN: 1,
        VENDOR: 2,
        CUSTOMER: 3
    },
    STORAGE_KEYS: {
        TOKEN: "token",
        USER: "user"
    }
};
