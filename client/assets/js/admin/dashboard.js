// ======================================
// Product Management System
// Admin Dashboard
// ======================================

requireRole(CONFIG.ROLES.ADMIN);

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

// ======================================

async function loadDashboard() {
    await Promise.all([
        loadCategories(),
        loadVendors(),
        loadProducts(),
        loadRecentProducts()
    ]);
}

// ======================================
// Categories
// ======================================

async function loadCategories() {
    try {
        const result = await API.get(CONFIG.API.ENDPOINTS.CATEGORIES.LIST);

        if (!result.success) return;

        document.getElementById("totalCategories").textContent = result.data.length;
    } catch (error) {
        console.error(error);
    }
}

// ======================================
// Vendors
// ======================================

async function loadVendors() {
    try {
        const result = await API.get(CONFIG.API.ENDPOINTS.VENDORS.STATS);

        if (!result.success) return;

        document.getElementById("totalVendors").textContent = result.data.total_vendors;
        document.getElementById("pendingVendors").textContent = result.data.pending;
    } catch (error) {
        console.error(error);
    }
}

// ======================================
// Products
// ======================================

async function loadProducts() {
    try {
        const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

        if (!result.success) return;

        document.getElementById("totalProducts").textContent = result.data.length;
    } catch (error) {
        console.error(error);
    }
}

// ======================================
// Recent Products
// ======================================

async function loadRecentProducts() {
    try {
        const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

        if (!result.success) return;

        const tbody = document.getElementById("recentProducts");
        tbody.innerHTML = "";

        result.data.slice(0, 5).forEach(product => {
            tbody.innerHTML += `
                <tr>
                    <td>${product.product_name}</td>
                    <td>${product.category_name}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td><span class="badge bg-${getStatusBadgeClass(product.product_status)}">${product.product_status}</span></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(error);
    }
}