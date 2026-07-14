// ======================================
// Landing Page Product Listing
// ======================================

let allProducts = [];
let allCategories = [];

document.addEventListener("DOMContentLoaded", () => {
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
    const response = await fetch(`${CONFIG.API.BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Unable to load categories");
      return;
    }

    const result = await response.json();

    if (result.success && result.data) {
      allCategories = result.data;
      populateCategoryFilter();
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// ======================================
// Populate Category Filter
// ======================================

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
    const response = await fetch(`${CONFIG.API.BASE_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      showNoProducts();
      return;
    }

    const result = await response.json();

    if (result.success && result.data) {
      // Only show approved products
      allProducts = result.data.filter((p) => p.approval_status === "Approved");
      renderProducts(allProducts);
    } else {
      showNoProducts();
    }
  } catch (error) {
    console.error("Error loading products:", error);
    showNoProducts();
  }
}

// ======================================
// Filter Products
// ======================================

function filterProducts() {
  const searchTerm = document
    .getElementById("productSearch")
    .value.toLowerCase();
  const categoryId = document.getElementById("categoryFilter").value;
  const sortBy = document.getElementById("sortFilter").value;

  let filtered = allProducts.filter((product) => {
    // Search filter
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    // Category filter
    const matchesCategory = !categoryId || product.category_id == categoryId;

    return matchesSearch && matchesCategory;
  });

  // Apply sorting
  filtered = sortProducts(filtered, sortBy);

  renderProducts(filtered);
}

// ======================================
// Sort Products
// ======================================

function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      sorted.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
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
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

// ======================================
// Create Product Card
// ======================================

function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 col-xl-3";

  const imageUrl = product.image_url
    ? `${CONFIG.API.BASE_URL.replace("/api", "")}${product.image_url}`
    : "assets/images/placeholder.png";

  const price = parseFloat(product.price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  col.innerHTML = `
        <div class="card h-100 product-card">
            <div class="product-image-wrapper">
                <img 
                    src="${imageUrl}" 
                    class="card-img-top" 
                    alt="${product.product_name}"
                    onerror="this.src='assets/images/placeholder.png'"
                />
                <div class="product-overlay">
                    <button class="btn btn-sm btn-primary" onclick="viewProduct(${product.product_id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
            <div class="card-body d-flex flex-column">
                <h6 class="card-title">${product.product_name}</h6>
                <p class="card-text text-muted small">
                    ${product.description.substring(0, 60)}${product.description.length > 60 ? "..." : ""}
                </p>
                <p class="card-text text-success fw-bold mt-auto mb-2">${price}</p>
                <small class="text-muted">
                    <i class="fas fa-tag"></i> ${product.category_name || "Uncategorized"}
                </small>
                <small class="text-muted d-block">
                    <i class="fas fa-user"></i> ${product.first_name} ${product.last_name}
                </small>
                <div class="mt-2 d-grid">
                    <button class="btn btn-outline-primary btn-sm" onclick="addToCart(${product.product_id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

  return col;
}

// ======================================
// View Product
// ======================================

function viewProduct(productId) {
  // For now, just log. Can be expanded later to show modal or redirect
  console.log("Viewing product:", productId);
  alert("Product detail view coming soon!");
}

// ======================================
// Add to Cart
// ======================================

function addToCart(productId) {
  alert("Cart functionality coming soon!");
}

// ======================================
// Show No Products
// ======================================

function showNoProducts() {
  const container = document.getElementById("productsContainer");
  const noProducts = document.getElementById("noProducts");

  container.innerHTML = "";
  noProducts.style.display = "block";
}
