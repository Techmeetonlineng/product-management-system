// ======================================
// Product Management System
// Vendor Products Module
// ======================================

requireRole(CONFIG.ROLES.VENDOR);

let products = [];

// ======================================
// Page Load
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadCategories();
    document.getElementById("searchProduct").addEventListener("keyup", searchProducts);
    document.getElementById("saveProductBtn").addEventListener("click", saveProduct);
});

// ======================================
// Load Vendor Products
// ======================================

async function loadProducts() {
    try {
        const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

        if (!result.success) {
            showError("Error", result.message);
            return;
        }

        const user = getCurrentUser();
        products = result.data.filter(product => product.vendor_id == user.user_id);
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

    if (data.length === 0) {
        table.innerHTML = `
        <tr>
            <td colspan="9" class="text-center">
                No products found.
            </td>
        </tr>
        `;
        return;
    }

    data.forEach(product => {
        table.innerHTML += `
        <tr>
            <td>${product.product_id}</td>
            <td>
                <img src="${
                    product.image
                    ? `http://localhost:5000/uploads/${product.image}`
                    : "/assets/images/no-image.png"
                }" width="60" height="60" style="object-fit:cover;border-radius:6px;">
            </td>
            <td>${product.product_name}</td>
            <td>${product.category_name}</td>
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
                <button class="btn btn-primary btn-sm" onclick="editProduct(${product.product_id})">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.product_id})">
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

        result.data.forEach(category => {
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
    const filtered = products.filter(product =>
        product.product_name.toLowerCase().includes(keyword)
    );
    renderProducts(filtered);
}
// ======================================
// Save Product (Create / Update)
// ======================================

async function saveProduct() {
    try {
        const id = document.getElementById("productId").value;
        const formData = new FormData();

        formData.append("category_id", document.getElementById("category_id").value);
        formData.append("product_name", document.getElementById("product_name").value.trim());
        formData.append("description", document.getElementById("description").value.trim());
        formData.append("sku", document.getElementById("sku").value.trim());
        formData.append("price", document.getElementById("price").value);
        formData.append("quantity", document.getElementById("quantity").value);
        formData.append("product_status", document.getElementById("product_status").value);

        const image = document.getElementById("image").files[0];
        if (image) {
            formData.append("image", image);
        }

        let endpoint = CONFIG.API.ENDPOINTS.PRODUCTS.CREATE;
        let method = "post";

        if (id) {
            endpoint = CONFIG.API.ENDPOINTS.PRODUCTS.UPDATE(id);
            method = "put";
        }

        const result = await API[method](endpoint, formData, true); // true for FormData

        if (!result.success) {
            showError("Error", result.message);
            return;
        }

        showSuccess("Success", result.message).then(() => {
            bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
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
    const product = products.find(p => p.product_id == id);
    if (!product) return;

    document.getElementById("productId").value = product.product_id;
    document.getElementById("product_name").value = product.product_name;
    document.getElementById("category_id").value = product.category_id;
    document.getElementById("description").value = product.description || "";
    document.getElementById("sku").value = product.sku || "";
    document.getElementById("price").value = product.price;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("product_status").value = product.product_status;

    new bootstrap.Modal(document.getElementById("productModal")).show();
}

// ======================================
// Delete Product
// ======================================

async function deleteProduct(id) {
    const confirm = await showConfirm("Delete Product?", "This action cannot be undone.");

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