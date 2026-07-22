// ======================================
// Product Management System
// Products Module
// ======================================

requireRole(CONFIG.ROLES.ADMIN);

let products = [];

// ======================================
// Page Load
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadCategories();

  document
    .getElementById("saveProductBtn")
    .addEventListener("click", saveProduct);
  document
    .getElementById("refreshProducts")
    .addEventListener("click", loadProducts);
  document
    .getElementById("searchProduct")
    .addEventListener("keyup", searchProducts);
});

// ======================================
// Load Products
// ======================================

async function loadProducts() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

    if (!result.success) {
      showError("Error", result.message);
      return;
    }

    products = result.data;
    renderProducts(products);
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to load products.");
  }
}

// ======================================
// Render Products
// ======================================

function renderProducts(data) {
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  data.forEach((product) => {
    table.innerHTML += `
        <tr>
            <td>${product.product_id}</td>
            <td>
                <img src="../../assets/images/no-image.png" width="50">
            </td>
            <td>${product.product_name}</td>
            <td>${product.category_name}</td>
            <td>${product.first_name} ${product.last_name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
            <td>
                <span class="badge bg-primary">
                    ${product.product_status}
                </span>
            </td>
            <td>
                <span class="badge bg-${getStatusBadgeClass(product.approval_status)}">
                    ${product.approval_status}
                </span>
            </td>
            <td>
                <button class="btn btn-success btn-sm" onclick="approveProduct(${product.product_id})">
                    <i class="fa fa-check"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectProduct(${product.product_id})">
                    <i class="fa fa-times"></i>
                </button>
                <button class="btn btn-dark btn-sm" onclick="editProduct(${product.product_id})">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-warning btn-sm" onclick="deleteProduct(${product.product_id})">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
  });
}

// ======================================
// Load Categories
// ======================================

async function loadCategories() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.CATEGORIES.LIST);

    if (!result.success) return;

    const select = document.getElementById("category_id");
    select.innerHTML = `<option value="">Select Category</option>`;

    result.data.forEach((category) => {
      select.innerHTML += `
                <option value="${category.category_id}">
                    ${category.category_name}
                </option>
            `;
    });
  } catch (error) {
    console.error(error);
  }
}

// ======================================
// Search Products
// ======================================

function searchProducts() {
  const keyword = document.getElementById("searchProduct").value.toLowerCase();
  const filtered = products.filter((product) =>
    product.product_name.toLowerCase().includes(keyword),
  );
  renderProducts(filtered);
}
// ======================================
// Save Product (Create / Update)
// ======================================

async function saveProduct() {
  try {
    const id = document.getElementById("productId").value;
    const category_id = document.getElementById("category_id").value;
    const product_name = document.getElementById("product_name").value.trim();
    const description = document.getElementById("description").value.trim();
    const sku = document.getElementById("sku").value.trim();
    const price = document.getElementById("price").value;
    const quantity = document.getElementById("quantity").value;
    const product_status = document.getElementById("product_status").value;

    // ==========================
    // Validation
    // ==========================
    if (!category_id) {
      showWarning("Validation", "Please select a category.");
      return;
    }

    if (product_name === "") {
      showWarning("Validation", "Product name is required.");
      return;
    }

    if (price === "" || isNaN(price)) {
      showWarning("Validation", "Enter a valid price.");
      return;
    }

    if (quantity === "" || isNaN(quantity)) {
      showWarning("Validation", "Enter a valid quantity.");
      return;
    }

    const product = {
      category_id: Number(category_id),
      product_name,
      description,
      sku,
      price: Number(price),
      quantity: Number(quantity),
      product_status,
    };

    let endpoint = CONFIG.API.ENDPOINTS.PRODUCTS.CREATE;
    let method = "post";

    if (id) {
      endpoint = CONFIG.API.ENDPOINTS.PRODUCTS.UPDATE(id);
      method = "put";
    }

    const result = await API[method](endpoint, product);

    if (!result.success) {
      showError("Error", result.message);
      return;
    }

    showSuccess("Success", result.message).then(() => {
      bootstrap.Modal.getInstance(
        document.getElementById("productModal"),
      ).hide();
      document.getElementById("productForm").reset();
      document.getElementById("productId").value = "";
      loadProducts();
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to save product.");
  }
}

// ======================================
// Edit Product
// ======================================

function editProduct(id) {
  const product = products.find((p) => p.product_id == id);
  if (!product) return;

  document.getElementById("productId").value = product.product_id;
  document.getElementById("product_name").value = product.product_name;
  document.getElementById("category_id").value = product.category_id;
  document.getElementById("description").value = product.description;
  document.getElementById("sku").value = product.sku;
  document.getElementById("price").value = Number(product.price);
  document.getElementById("quantity").value = Number(product.quantity);
  document.getElementById("product_status").value = product.product_status;

  new bootstrap.Modal(document.getElementById("productModal")).show();
}

// ======================================
// Delete Product
// ======================================

async function deleteProduct(id) {
  const confirm = await showConfirm(
    "Delete Product?",
    "This action cannot be undone.",
  );

  if (!confirm.isConfirmed) return;

  try {
    const result = await API.delete(CONFIG.API.ENDPOINTS.PRODUCTS.DELETE(id));

    if (!result.success) {
      showError("Error", result.message);
      return;
    }

    showSuccess("Deleted", result.message).then(() => {
      loadProducts();
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to delete product.");
  }
}

// ======================================
// Approve Product
// ======================================

async function approveProduct(id) {
  try {
    const result = await API.put(CONFIG.API.ENDPOINTS.PRODUCTS.APPROVE(id), {});

    showSuccess("Success", result.message);
    loadProducts();
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to approve product.");
  }
}

// ======================================
// Reject Product
// ======================================

async function rejectProduct(id) {
  try {
    const result = await API.put(CONFIG.API.ENDPOINTS.PRODUCTS.REJECT(id), {});

    showError("Rejected", result.message);
    loadProducts();
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to reject product.");
  }
}
