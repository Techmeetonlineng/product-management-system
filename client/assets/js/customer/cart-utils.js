// ======================================
// Customer Cart — Shared Utility
// ======================================
// NOTE: The backend does not expose cart/order endpoints yet, so the
// cart is kept in localStorage, scoped per logged-in user. This mirrors
// the existing "local-only for now" pattern already used in
// assets/js/vendor/profile.js for fields the API doesn't support yet.

const CART_STORAGE_PREFIX = "pms_cart_";

/**
 * Cart is scoped to the logged-in user so different accounts on the
 * same browser don't share a cart.
 */
function getCartStorageKey() {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const userId = user?.user_id || "guest";
  return `${CART_STORAGE_PREFIX}${userId}`;
}

/**
 * Get the current cart as an array of:
 * { product_id, product_name, price, image, quantity, max_quantity }
 */
function getCart() {
  try {
    const raw = localStorage.getItem(getCartStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Unable to read cart:", error);
    return [];
  }
}

/**
 * Persist the cart and refresh any cart badges on the page.
 */
function saveCart(cart) {
  localStorage.setItem(getCartStorageKey(), JSON.stringify(cart));
  updateCartBadge();
}

/**
 * Add a product to the cart (or increment quantity if already present).
 */
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.product_id === product.product_id);
  const maxQuantity = Number(product.quantity) || 0;

  if (existing) {
    existing.quantity = Math.min(
      existing.quantity + quantity,
      maxQuantity || existing.quantity + quantity,
    );
  } else {
    cart.push({
      product_id: product.product_id,
      product_name: product.product_name,
      price: Number(product.price) || 0,
      image: product.image || null,
      vendor_name:
        `${product.first_name || ""} ${product.last_name || ""}`.trim(),
      quantity: Math.max(1, Math.min(quantity, maxQuantity || quantity)),
      max_quantity: maxQuantity,
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Update the quantity of a single cart line. Removes the line if the
 * quantity drops to 0 or below.
 */
function updateCartQuantity(productId, quantity) {
  let cart = getCart();

  if (quantity <= 0) {
    cart = cart.filter((item) => item.product_id !== productId);
  } else {
    const item = cart.find((item) => item.product_id === productId);
    if (item) {
      const max = item.max_quantity || quantity;
      item.quantity = Math.min(quantity, max);
    }
  }

  saveCart(cart);
  return cart;
}

/**
 * Remove a single line from the cart entirely.
 */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.product_id !== productId);
  saveCart(cart);
  return cart;
}

/**
 * Clear the cart completely (used after checkout).
 */
function clearCart() {
  saveCart([]);
}

/**
 * Total number of items in the cart (sum of quantities).
 */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Cart subtotal.
 */
function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Resolve a product's image URL the same way the landing page does.
 */
function getProductImageUrl(product) {
  // No image
  if (!product.image) {
    return "/assets/images/no-image.png";
  }

  // Cloudinary image
  if (product.image.startsWith("http")) {
    return product.image;
  }

  // Old local upload
  return `/uploads/${product.image}`;
}

/**
 * Update the little cart-count badge in the navbar, if present on the page.
 */
function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;

  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-flex" : "none";
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
