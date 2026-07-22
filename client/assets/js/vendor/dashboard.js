// ======================================
// Vendor Dashboard
// ======================================

requireRole(CONFIG.ROLES.VENDOR);

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

// ======================================
// Load Dashboard
// ======================================

async function loadDashboard() {
  try {
    await Promise.all([
      loadProductStats(),
      loadRecentProducts(),
      loadApprovalStats(),
    ]);
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to load dashboard data.");
  }
}

// ======================================
// Load Product Statistics
// ======================================

async function loadProductStats() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

    if (!result.success) return;

    const user = getCurrentUser();
    const vendorProducts = result.data.filter(
      (p) => p.vendor_id === user.user_id,
    );

    const approved = vendorProducts.filter(
      (p) => p.approval_status === "Approved",
    ).length;
    const pending = vendorProducts.filter(
      (p) => p.approval_status === "Pending",
    ).length;
    const rejected = vendorProducts.filter(
      (p) => p.approval_status === "Rejected",
    ).length;

    if (document.getElementById("totalProducts")) {
      document.getElementById("totalProducts").textContent =
        vendorProducts.length;
    }
    if (document.getElementById("approvedProducts")) {
      document.getElementById("approvedProducts").textContent = approved;
    }
    if (document.getElementById("pendingProducts")) {
      document.getElementById("pendingProducts").textContent = pending;
    }
    if (document.getElementById("rejectedProducts")) {
      document.getElementById("rejectedProducts").textContent = rejected;
    }
  } catch (error) {
    console.error(error);
  }
}

// ======================================
// Load Recent Products
// ======================================

async function loadRecentProducts() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

    if (!result.success) return;

    const user = getCurrentUser();
    const vendorProducts = result.data
      .filter((p) => p.vendor_id === user.user_id)
      .slice(0, 5);

    const tbody = document.getElementById("recentProducts");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (vendorProducts.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center">No products yet.</td></tr>';
      return;
    }

    vendorProducts.forEach((product) => {
      tbody.innerHTML += `
                <tr>
                    <td>${product.product_name}</td>
                    <td>${product.category_name}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td>
                        <span class="badge bg-${getStatusBadgeClass(product.approval_status)}">
                            ${product.approval_status}
                        </span>
                    </td>
                    <td>${formatDate(product.created_at)}</td>
                </tr>
            `;
    });
  } catch (error) {
    console.error(error);
  }
}

// ======================================
// Load Approval Statistics
// ======================================

async function loadApprovalStats() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.VENDORS.STATS);

    if (!result.success || !result.data) return;

    if (document.getElementById("accountStatus")) {
      document.getElementById("accountStatus").textContent =
        getCurrentUser().account_status;
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadDashboard() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    document.getElementById("vendorName").innerHTML =
      `${user.first_name} ${user.last_name}`;

    const response = await fetch(`${CONFIG.API.BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const result = await response.json();

    if (!result.success) return;

    const products = result.data.filter(
      (product) => product.vendor_id === user.user_id,
    );

    document.getElementById("totalProducts").innerHTML = products.length;

    const pending = products.filter(
      (product) => product.approval_status === "Pending",
    );

    document.getElementById("pendingProducts").innerHTML = pending.length;

    const approved = products.filter(
      (product) => product.approval_status === "Approved",
    );

    document.getElementById("approvedProducts").innerHTML = approved.length;
  } catch (error) {
    console.error(error);
  }
}

// ======================================
// Logout
// ======================================

function logout() {
  Swal.fire({
    title: "Logout?",

    text: "Are you sure you want to logout?",

    icon: "question",

    showCancelButton: true,

    confirmButtonText: "Logout",
  }).then((result) => {
    if (!result.isConfirmed) return;

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "../../login.html";
  });
}
