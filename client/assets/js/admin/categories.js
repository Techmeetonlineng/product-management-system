// ======================================
// Category Management
// ======================================

// Ensure the modal exists before attaching events
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();

  document.getElementById("saveBtn")?.addEventListener("click", saveCategory);
  document
    .getElementById("categoryModal")
    ?.addEventListener("hidden.bs.modal", resetForm);
  document
    .getElementById("searchInput")
    ?.addEventListener("keyup", searchCategories);
});

let categories = [];

// ======================================
// Load Categories
// ======================================
async function loadCategories() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.CATEGORIES.LIST);

    if (!result.success) {
      Swal.fire(
        "Error",
        result.message || "Failed to load categories.",
        "error",
      );
      return;
    }

    categories = result.data;
    renderTable(categories);
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Unable to load categories.", "error");
  }
}

// ======================================
// Render Table
// ======================================
function renderTable(data) {
  const tableBody = document.getElementById("categoryTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center">No categories found.</td></tr>';
    return;
  }

  data.forEach((category) => {
    tableBody.innerHTML += `
            <tr>
                <td>${category.category_id}</td>
                <td>${category.category_name}</td>
                <td>${category.description || "N/A"}</td>
                <td><span class="badge bg-${category.status === "Active" ? "success" : "secondary"}">${category.status || "Active"}</span></td>
                <td>${new Date(category.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editCategory(${category.category_id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.category_id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
  });
}

// ======================================
// Save/Update Category
// ======================================
async function saveCategory() {
  const id = document.getElementById("categoryId").value;
  const data = {
    category_name: document.getElementById("categoryName").value.trim(),
    description: document.getElementById("description").value.trim(),
    status: document.getElementById("status").value,
  };

  if (!data.category_name) {
    Swal.fire("Validation", "Category Name is required.", "warning");
    return;
  }

  try {
    const result = id
      ? await API.put(CONFIG.API.ENDPOINTS.CATEGORIES.UPDATE(id), data)
      : await API.post(CONFIG.API.ENDPOINTS.CATEGORIES.CREATE, data);

    if (!result.success) {
      Swal.fire("Error", result.message, "error");
      return;
    }

    Swal.fire("Success", result.message, "success");
    bootstrap.Modal.getInstance(
      document.getElementById("categoryModal"),
    ).hide();
    loadCategories();
  } catch (error) {
    Swal.fire("Error", "Unable to save category.", "error");
  }
}

// ======================================
// Edit / Delete Helpers
// ======================================
function editCategory(id) {
  const category = categories.find((c) => c.category_id == id);
  if (!category) return;

  document.getElementById("categoryId").value = category.category_id;
  document.getElementById("categoryName").value = category.category_name;
  document.getElementById("description").value = category.description || "";
  document.getElementById("status").value = category.status || "Active";
  document.getElementById("modalTitle").innerText = "Edit Category";

  new bootstrap.Modal(document.getElementById("categoryModal")).show();
}

async function deleteCategory(id) {
  const confirm = await Swal.fire({
    title: "Delete Category?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
  });

  if (!confirm.isConfirmed) return;

  const result = await API.delete(CONFIG.API.ENDPOINTS.CATEGORIES.DELETE(id));
  if (result.success) {
    Swal.fire("Deleted", result.message, "success");
    loadCategories();
  } else {
    Swal.fire("Error", result.message, "error");
  }
}

function resetForm() {
  document.getElementById("categoryId").value = "";
  document.getElementById("categoryName").value = "";
  document.getElementById("description").value = "";
  document.getElementById("status").value = "Active";
  document.getElementById("modalTitle").innerText = "Add Category";
}

function searchCategories() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = categories.filter(
    (c) =>
      c.category_name.toLowerCase().includes(keyword) ||
      (c.description || "").toLowerCase().includes(keyword),
  );
  renderTable(filtered);
}
