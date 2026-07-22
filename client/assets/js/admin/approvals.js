// ======================================
// Product Approval Module
// ======================================

requireRole(CONFIG.ROLES.ADMIN);

let pendingProducts = [];

document.addEventListener("DOMContentLoaded", loadPendingProducts);

// ======================================
// Load Pending Products
// ======================================

async function loadPendingProducts() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

    if (!result.success) {
      showError("Error", result.message);
      return;
    }

    pendingProducts = result.data.filter(
      (product) => product.approval_status === "Pending",
    );

    renderProducts(pendingProducts);
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to load pending products.");
  }
}

// ======================================
// Render Products
// ======================================

function renderProducts(data) {
  const table = document.getElementById("approvalsTable");
  if (!table) return;

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML =
      '<tr><td colspan="8" class="text-center">No pending products.</td></tr>';
    return;
  }

  data.forEach((product) => {
    table.innerHTML += `
        <tr>
            <td>${product.product_id}</td>
            <td>${product.product_name}</td>
            <td>${product.category_name}</td>
            <td>${product.first_name} ${product.last_name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
            <td>${formatDate(product.created_at)}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="approveProduct(${product.product_id})">
                    <i class="fa fa-check"></i> Approve
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectProduct(${product.product_id})">
                    <i class="fa fa-times"></i> Reject
                </button>
                <button class="btn btn-info btn-sm" onclick="viewProduct(${product.product_id})">
                    <i class="fa fa-eye"></i> View
                </button>
            </td>
        </tr>
        `;
  });

  document.getElementById("pendingCount").textContent = data.length;
}

// ======================================
// Approve Product
// ======================================

async function approveProduct(id) {
  const confirm = await showConfirm(
    "Approve Product?",
    "This product will be visible to customers.",
  );

  if (!confirm.isConfirmed) return;

  try {
    const result = await API.put(CONFIG.API.ENDPOINTS.PRODUCTS.APPROVE(id), {});

    showSuccess("Approved", result.message).then(() => {
      loadPendingProducts();
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to approve product.");
  }
}

// ======================================
// Reject Product
// ======================================

async function rejectProduct(id) {
  const { value: reason } = await Swal.fire({
    title: "Reject Product",
    input: "textarea",
    inputPlaceholder: "Enter reason for rejection...",
    showCancelButton: true,
    confirmButtonText: "Reject",
    inputValidator: (value) => {
      if (!value) {
        return "Please provide a reason!";
      }
    },
  });

  if (!reason) return;

  try {
    const result = await API.put(CONFIG.API.ENDPOINTS.PRODUCTS.REJECT(id), {
      reason,
    });

    showError("Rejected", result.message).then(() => {
      loadPendingProducts();
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to reject product.");
  }
}

// ======================================
// View Product
// ======================================

function viewProduct(id) {
  const product = pendingProducts.find((p) => p.product_id == id);
  if (!product) return;

  Swal.fire({
    title: product.product_name,
    html: `
            <div class="text-start">
                <p><strong>Category:</strong> ${product.category_name}</p>
                <p><strong>Vendor:</strong> ${product.first_name} ${product.last_name}</p>
                <p><strong>Price:</strong> ${formatCurrency(product.price)}</p>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p><strong>Description:</strong> ${product.description || "N/A"}</p>
                <p><strong>Status:</strong> ${product.product_status}</p>
                <p><strong>Created:</strong> ${formatDateTime(product.created_at)}</p>
            </div>
        `,
    confirmButtonText: "Close",
  });
}
