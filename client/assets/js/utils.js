// =========================================
// Product Management System
// Utility Functions
// =========================================

/**
 * Require user to be logged in, redirect to login if not
 */
function requireLogin() {
    if (!API.isAuthenticated()) {
        window.location.href = "/login.html";
    }
}

/**
 * Require specific role, redirect to login if not authorized
 */
function requireRole(roleId) {
    if (!API.isAuthenticated()) {
        window.location.href = "/login.html";
        return;
    }

    const user = API.getUser();
    if (user.role_id !== roleId) {
        Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "You do not have permission to access this page."
        }).then(() => {
            window.location.href = "/login.html";
        });
    }
}

/**
 * Require any of the specified roles
 */
function requireAnyRole(...roleIds) {
    if (!API.isAuthenticated()) {
        window.location.href = "/login.html";
        return;
    }

    const user = API.getUser();
    if (!roleIds.includes(user.role_id)) {
        Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "You do not have permission to access this page."
        }).then(() => {
            window.location.href = "/login.html";
        });
    }
}

/**
 * Logout user
 */
function logout() {
    API.logout();
}

/**
 * Show success notification
 */
function showSuccess(title = "Success", text = "") {
    return Swal.fire({
        icon: "success",
        title,
        text
    });
}

/**
 * Show error notification
 */
function showError(title = "Error", text = "") {
    return Swal.fire({
        icon: "error",
        title,
        text
    });
}

/**
 * Show warning notification
 */
function showWarning(title = "Warning", text = "") {
    return Swal.fire({
        icon: "warning",
        title,
        text
    });
}

/**
 * Show info notification
 */
function showInfo(title = "Info", text = "") {
    return Swal.fire({
        icon: "info",
        title,
        text
    });
}

/**
 * Show confirmation dialog
 */
function showConfirm(title = "Confirm", text = "Are you sure?") {
    return Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
    });
}

/**
 * Format currency (Nigerian Naira)
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateString) {
    return new Intl.DateTimeFormat('en-NG').format(new Date(dateString));
}

/**
 * Format datetime
 */
function formatDateTime(dateString) {
    return new Intl.DateTimeFormat('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateString));
}

/**
 * Get badge class based on status
 */
function getStatusBadgeClass(status) {
    const statusMap = {
        'Approved': 'success',
        'Pending': 'warning',
        'Rejected': 'danger',
        'Suspended': 'dark',
        'Active': 'success',
        'Inactive': 'secondary'
    };
    return statusMap[status] || 'secondary';
}

/**
 * Validate email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone
 */
function isValidPhone(phone) {
    const re = /^[\d+\-\s()]{10,}$/;
    return re.test(phone);
}

/**
 * Trim and validate required field
 */
function validateRequired(value, fieldName = "Field") {
    const trimmed = String(value).trim();
    if (!trimmed) {
        throw new Error(`${fieldName} is required.`);
    }
    return trimmed;
}

/**
 * Get current user
 */
function getCurrentUser() {
    return API.getUser();
}

/**
 * Setup logout button
 */
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
});
