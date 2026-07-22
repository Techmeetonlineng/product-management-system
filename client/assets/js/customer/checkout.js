// ======================================
// Customer — Checkout
// ======================================

requireRole(CONFIG.ROLES.CUSTOMER);

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "../../login.html";
    return;
  }

  if (getCart().length === 0) {
    showInfo("Cart is empty", "Add a product before checking out.").then(() => {
      window.location.href = "home.html";
    });
    return;
  }

  document.getElementById("customerName").textContent =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Customer";

  // Pre-fill known details.
  document.getElementById("fullName").value =
    `${user.first_name || ""} ${user.last_name || ""}`.trim();
  document.getElementById("phone").value = user.phone || "";

  renderOrderSummary();

  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
});

// ======================================
// Render Order Summary
// ======================================

function renderOrderSummary() {
  const cart = getCart();
  const container = document.getElementById("checkoutItems");

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="d-flex justify-content-between mb-2">
            <span>${item.product_name} <span class="text-muted">x${item.quantity}</span></span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `,
    )
    .join("");

  document.getElementById("summaryCount").textContent = getCartCount();
  document.getElementById("summaryTotal").textContent = formatCurrency(getCartTotal());
}

// ======================================
// Place Order
// ======================================

function placeOrder() {
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!fullName || !address) {
    showWarning("Missing Details", "Please fill in your name and delivery address.");
    return;
  }

  if (phone && !isValidPhone(phone)) {
    showWarning("Validation", "Please enter a valid phone number.");
    return;
  }

  // NOTE: The backend does not yet expose an orders endpoint, so the
  // order is recorded locally as a receipt/confirmation. Once an
  // /api/orders endpoint exists, replace this with:
  //   await API.post(CONFIG.API.ENDPOINTS.ORDERS.CREATE, orderPayload)
  const order = {
    order_ref: `ORD-${Date.now()}`,
    items: getCart(),
    total: getCartTotal(),
    shipping: { fullName, phone, address },
    placed_at: new Date().toISOString(),
  };

  saveLocalOrder(order);
  clearCart();

  Swal.fire({
    icon: "success",
    title: "Order Placed!",
    html: `Your order <strong>${order.order_ref}</strong> has been received.<br>Total: ${formatCurrency(order.total)}`,
    confirmButtonText: "Back to Dashboard",
  }).then(() => {
    window.location.href = "dashboard.html";
  });
}

// ======================================
// Local Order History (until /api/orders exists)
// ======================================

function saveLocalOrder(order) {
  const user = getCurrentUser();
  const key = `pms_orders_${user?.user_id || "guest"}`;

  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift(order);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (error) {
    console.error("Unable to save order locally:", error);
  }
}
