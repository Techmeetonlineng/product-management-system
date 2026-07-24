// ======================================
// Customer — Browse Products
// ======================================

requireRole(CONFIG.ROLES.CUSTOMER);

let allProducts = [];
let allCategories = [];

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (user) {
    const name =
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Customer";
    document.getElementById("customerName").textContent = name;
  }

  loadCategories();
  loadProducts();
  setupEventListeners();
});

// ======================================
// Setup Event Listeners
// ======================================

function setupEventListeners() {
  document
    .getElementById("productSearch")
    .addEventListener("input", filterProducts);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterProducts);
  document
    .getElementById("sortFilter")
    .addEventListener("change", filterProducts);
}

// ======================================
// Load Categories
// ======================================

async function loadCategories() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.CATEGORIES.LIST);

    if (!result.success) return;

    allCategories = result.data;
    populateCategoryFilter();
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

function populateCategoryFilter() {
  const categorySelect = document.getElementById("categoryFilter");

  allCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.category_id;
    option.textContent = category.category_name;
    categorySelect.appendChild(option);
  });
}

// ======================================
// Load Products
// ======================================

async function loadProducts() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

    if (!result.success) {
      showNoProducts();
      return;
    }

    // Only show products that are approved and in stock to customers.
    allProducts = (result.data || []).filter(
      (product) =>
        product.approval_status === "Approved" &&
        product.product_status === "Available",
    );

    renderProducts(allProducts);
  } catch (error) {
    console.error("Error loading products:", error);
    showNoProducts();
  }
}

// ======================================
// Filter / Sort
// ======================================

function filterProducts() {
  const searchTerm = document
    .getElementById("productSearch")
    .value.toLowerCase();
  const categoryId = document.getElementById("categoryFilter").value;
  const sortBy = document.getElementById("sortFilter").value;

  let filtered = allProducts.filter((product) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm) ||
      (product.description || "").toLowerCase().includes(searchTerm);

    const matchesCategory = !categoryId || product.category_id == categoryId;

    return matchesSearch && matchesCategory;
  });

  filtered = sortProducts(filtered, sortBy);

  renderProducts(filtered);
}

function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
  }

  return sorted;
}

// ======================================
// Render Products
// ======================================

function renderProducts(products) {
  const container = document.getElementById("productsContainer");
  const noProducts = document.getElementById("noProducts");

  if (products.length === 0) {
    container.innerHTML = "";
    noProducts.style.display = "block";
    return;
  }

  noProducts.style.display = "none";
  container.innerHTML = "";

  products.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
}

function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 col-xl-3";

  const imageUrl = getProductImageUrl(product);
  const price = formatCurrency(product.price);
  const inStock = Number(product.quantity) > 0;

  col.innerHTML = `
        <div class="card h-100 product-card">
            <div class="product-image-wrapper">
                <img
                    src="${imageUrl}"
                    class="card-img-top"
                    alt="${product.product_name}"
                    onerror="this.onerror=null;this.src='/assets/images/no-image.png';"
                />
            </div>
            <div class="card-body d-flex flex-column">
                <h6 class="card-title">${product.product_name}</h6>
                <p class="card-text text-muted small">
                    ${(product.description || "").substring(0, 60)}${(product.description || "").length > 60 ? "..." : ""}
                </p>
                <p class="card-text text-success fw-bold mt-auto mb-2">${price}</p>
                <small class="text-muted">
                    <i class="fas fa-tag"></i> ${product.category_name || "Uncategorized"}
                </small>
                <small class="text-muted d-block mb-2">
                    <i class="fas fa-user"></i> ${product.first_name || ""} ${product.last_name || ""}
                </small>
                <div class="d-grid">
                    <button
                        class="btn btn-outline-primary btn-sm"
                        ${inStock ? "" : "disabled"}
                        onclick="handleAddToCart(${product.product_id})"
                    >
                        <i class="fas fa-cart-plus"></i> ${inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                </div>
            </div>
        </div>
    `;

  return col;
}

// ======================================
// Add to Cart
// ======================================

function handleAddToCart(productId) {
  const product = allProducts.find((p) => p.product_id === productId);
  if (!product) return;

  addToCart(product, 1);
  showSuccess(
    "Added to Cart",
    `${product.product_name} was added to your cart.`,
  );
}

// ======================================
// Empty State
// ======================================

function showNoProducts() {
  const container = document.getElementById("productsContainer");
  const noProducts = document.getElementById("noProducts");

  container.innerHTML = "";
  noProducts.style.display = "block";
}
