// =========================================
// Product Management System
// Configuration
// =========================================

const CONFIG = {
  API: {
    // The client and the API are always served from the same Express
    // app/origin (see server/app.js), whether that's localhost during
    // development or your deployed URL (Render, Railway, etc.) in
    // production - so deriving this from the current page's origin
    // means it works correctly everywhere with no per-environment
    // configuration needed. (Previously this was hardcoded to
    // "http://localhost:5000/api", which meant every API call from a
    // deployed copy of this site would silently fail, since the
    // browser would keep trying to reach localhost.)
    BASE_URL: `${window.location.origin}/api`,
    ENDPOINTS: {
      // Auth endpoints
      AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        ME: "/auth/me",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
      },
      // Product endpoints
      PRODUCTS: {
        LIST: "/products",
        PUBLIC: "/products/public",
        GET: (id) => `/products/${id}`,
        CREATE: "/products",
        UPDATE: (id) => `/products/${id}`,
        DELETE: (id) => `/products/${id}`,
        APPROVE: (id) => `/products/${id}/approve`,
        REJECT: (id) => `/products/${id}/reject`,
      },
      // Category endpoints
      CATEGORIES: {
        LIST: "/categories",
        GET: (id) => `/categories/${id}`,
        CREATE: "/categories",
        UPDATE: (id) => `/categories/${id}`,
        DELETE: (id) => `/categories/${id}`,
      },
      // Vendor endpoints
      VENDORS: {
        LIST: "/vendors",
        GET: (id) => `/vendors/${id}`,
        STATS: "/vendors/stats",
        APPROVE: (id) => `/vendors/${id}/approve`,
        REJECT: (id) => `/vendors/${id}/reject`,
        SUSPEND: (id) => `/vendors/${id}/suspend`,
      },
      // Dashboard endpoints
      DASHBOARD: {
        GET: "/dashboard",
      },
    },
  },
  ROLES: {
    ADMIN: 1,
    VENDOR: 2,
    CUSTOMER: 3,
  },
  STORAGE_KEYS: {
    TOKEN: "token",
    USER: "user",
  },
};
