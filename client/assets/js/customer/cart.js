// ======================================
// Customer — Cart Page
// ======================================

requireRole(CONFIG.ROLES.CUSTOMER);

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (user) {
    const name =
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Customer";
    document.getElementById("customerName").textContent = name;
  }

  renderCart();

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (getCart().length === 0) {
      showWarning("Cart is empty", "Add a product before checking out.");
      return;
    }
    window.location.href = "checkout.html";
  });
});

// ======================================
// Render Cart
// ======================================

function renderCart() {
  const cart = getCart();
  const table = document.getElementById("cartTable");
  const emptyState = document.getElementById("emptyCart");

  if (cart.length === 0) {
    table.innerHTML = "";
    emptyState.style.display = "block";
    updateSummary();
    return;
  }

  emptyState.style.display = "none";
  table.innerHTML = "";

  cart.forEach((item) => {
    const imageUrl = getProductImageUrl(item);
    const subtotal = formatCurrency(item.price * item.quantity);

    table.innerHTML += `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img src="${imageUrl}" alt="${item.product_name} onerror="this.onerror=null;this.src='/assets/images/no-image.png';'">
                    <div>
                        <div class="fw-semibold">${item.product_name}</div>
                        <small class="text-muted">${item.vendor_name || ""}</small>
                    </div>
                </div>
            </td>
            <td>${formatCurrency(item.price)}</td>
            <td style="max-width:130px">
                <div class="input-group input-group-sm">
                    <button class="btn btn-outline-secondary" onclick="changeQuantity(${item.product_id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary" onclick="changeQuantity(${item.product_id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </td>
            <td class="fw-semibold">${subtotal}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.product_id})" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
  });

  updateSummary();
}

// ======================================
// Update Summary
// ======================================

function updateSummary() {
  document.getElementById("summaryCount").textContent = getCartCount();
  document.getElementById("summaryTotal").textContent =
    formatCurrency(getCartTotal());
}

// ======================================
// Quantity / Remove Handlers
// ======================================

function changeQuantity(productId, newQuantity) {
  updateCartQuantity(productId, newQuantity);
  renderCart();
}

function removeItem(productId) {
  showConfirm("Remove Item", "Remove this product from your cart?").then(
    (result) => {
      if (!result.isConfirmed) return;
      removeFromCart(productId);
      renderCart();
    },
  );
}
