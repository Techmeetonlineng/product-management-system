// ======================================
// Vendor Inventory Management
// ======================================

requireRole(CONFIG.ROLES.VENDOR);

const user = getCurrentUser();
let inventoryProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  loadInventory();
  document
    .getElementById("refreshInventory")
    ?.addEventListener("click", loadInventory);
  document
    .getElementById("searchInventory")
    ?.addEventListener("keyup", searchInventory);
});

// ======================================
// Load Inventory
// ======================================

async function loadInventory() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

    if (!result.success) {
      showError("Error", result.message);
      return;
    }

    inventoryProducts = result.data.filter((p) => p.vendor_id === user.user_id);
    renderInventory(inventoryProducts);
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to load inventory.");
  }
}

// ======================================
// Render Inventory
// ======================================

function renderInventory(data) {
  const table = document.getElementById("inventoryTable");
  if (!table) return;

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML =
      '<tr><td colspan="6" class="text-center">No products in inventory.</td></tr>';
    return;
  }

  data.forEach((product) => {
    const stockStatus =
      product.quantity > 10
        ? "success"
        : product.quantity > 0
          ? "warning"
          : "danger";
    const stockText =
      product.quantity > 10
        ? "In Stock"
        : product.quantity > 0
          ? "Low Stock"
          : "Out of Stock";

    table.innerHTML += `
        <tr>
            <td>${product.product_id}</td>
            <td>${product.product_name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
            <td>
                <span class="badge bg-${stockStatus}">
                    ${stockText}
                </span>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editProduct(${product.product_id})">
                    <i class="fa fa-edit"></i>
                </button>
            </td>
        </tr>
        `;
  });
}

// ======================================
// Search Inventory
// ======================================

function searchInventory() {
  const keyword =
    document.getElementById("searchInventory")?.value.toLowerCase() || "";
  const filtered = inventoryProducts.filter((p) =>
    p.product_name.toLowerCase().includes(keyword),
  );
  try {
    renderInventory(filtered);
  } catch (error) {
    console.error(error);

    Swal.fire("Error", "Unable to load inventory.", "error");
  }
}

// ======================================
// Render Inventory
// ======================================

function renderInventory(products) {
  const table = document.getElementById("inventoryTable");

  table.innerHTML = "";

  if (products.length === 0) {
    table.innerHTML = `

        <tr>

            <td colspan="7" class="text-center">

                No products found.

            </td>

        </tr>

        `;

    return;
  }

  products.forEach((product) => {
    const image = product.image
      ? `${CONFIG.API.BASE_URL.replace("/api", "")}/uploads/${product.image}`
      : "../../assets/images/no-image.png";

    table.innerHTML += `

        <tr>

            <td>${product.product_id}</td>

            <td>

                <img
                    src="${image}"
                    width="60"
                    height="60"
                    style="object-fit:cover;border-radius:6px;">

            </td>

            <td>${product.product_name}</td>

            <td>${product.category_name}</td>

            <td>₦${Number(product.price).toLocaleString()}</td>

            <td>${product.quantity}</td>

            <td>

                <span class="badge bg-success">

                    ${product.product_status}

                </span>

            </td>

        </tr>

        `;
  });
}
