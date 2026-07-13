// ======================================
// Category Management
// ======================================

requireRole(CONFIG.ROLES.ADMIN);

let categories = [];

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  document
    .getElementById("saveCategoryBtn")
    ?.addEventListener("click", saveCategory);
  document
    .getElementById("refreshCategories")
    ?.addEventListener("click", loadCategories);
  document
    .getElementById("searchCategory")
    ?.addEventListener("keyup", searchCategories);
});

// ======================================
// Load Categories
// ======================================

async function loadCategories() {
  try {
    const result = await API.get(CONFIG.API.ENDPOINTS.CATEGORIES.LIST);

    if (!result.success) {
      showError("Error", result.message);
      return;
    }

    categories = result.data;
    renderCategories(categories);
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to load categories.");
  }
}

// ======================================
// Render Categories
// ======================================

function renderCategories(data) {
  const table = document.getElementById("categoryTable");
  if (!table) return;

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML =
      '<tr><td colspan="5" class="text-center">No categories found.</td></tr>';
    return;
  }

  data.forEach((category) => {
    table.innerHTML += `
        <tr>
            <td>${category.category_id}</td>
            <td>${category.category_name}</td>
            <td>${category.description || "N/A"}</td>
            <td>
                <span class="badge bg-success">Active</span>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editCategory(${category.category_id})">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.category_id})">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
  });
}

// ======================================
// Search Categories
// ======================================

function searchCategories() {
  const keyword =
    document.getElementById("searchCategory")?.value.toLowerCase() || "";
  const filtered = categories.filter((cat) =>
    cat.category_name.toLowerCase().includes(keyword),
  );
  renderCategories(filtered);
}

// ======================================
// Save Category
// ======================================

async function saveCategory() {
  try {
    const id = document.getElementById("categoryId")?.value;
    const category_name =
      document.getElementById("category_name")?.value.trim() || "";
    const description =
      document.getElementById("category_description")?.value.trim() || "";

    if (!category_name) {
      showWarning("Validation", "Category name is required.");
      return;
    }

    const data = { category_name, description };

    let endpoint = CONFIG.API.ENDPOINTS.CATEGORIES.CREATE;
    let method = "post";

    if (id) {
      endpoint = CONFIG.API.ENDPOINTS.CATEGORIES.UPDATE(id);
      method = "put";
    }

    const result = await API[method](endpoint, data);

    if (!result.success) {
      showError("Error", result.message);
      return;
    }

    showSuccess("Success", result.message).then(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("categoryModal"),
      );
      modal?.hide();
      document.getElementById("categoryForm")?.reset();
      loadCategories();
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to save category.");
  }
}

// ======================================
// Edit Category
// ======================================

function editCategory(id) {
  const category = categories.find((c) => c.category_id == id);
  if (!category) return;

  const categoryId = document.getElementById("categoryId");
  const categoryName = document.getElementById("category_name");
  const categoryDesc = document.getElementById("category_description");

  if (categoryId) categoryId.value = category.category_id;
  if (categoryName) categoryName.value = category.category_name;
  if (categoryDesc) categoryDesc.value = category.description || "";

  const modal = document.getElementById("categoryModal");
  if (modal) {
    new bootstrap.Modal(modal).show();
  }
}

// ======================================
// Delete Category
// ======================================

async function deleteCategory(id) {
  const confirm = await showConfirm(
    "Delete Category?",
    "This action cannot be undone.",
  );

  if (!confirm.isConfirmed) return;

  try {
    const result = await API.delete(CONFIG.API.ENDPOINTS.CATEGORIES.DELETE(id));

    if (!result.success) {
      showError("Error", result.message);
      return;
    }

    showSuccess("Deleted", result.message).then(() => {
      loadCategories();
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to delete category.");
  }

  Authorization: `Bearer ${token}`;
}

// =============================================
// Load Categories
// =============================================

async function loadCategories() {
  try {
    const response = await fetch(API_URL, {
      headers,
    });

    const result = await response.json();

    if (!result.success) {
      Swal.fire("Error", result.message, "error");

      return;
    }

    categories = result.data;

    renderTable(categories);
  } catch (error) {
    console.error(error);

    Swal.fire(
      "Error",

      "Unable to load categories.",

      "error",
    );
  }
}

// =============================================
// Render Table
// =============================================

function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `

        <tr>

            <td colspan="6" class="text-center">

                No Categories Found

            </td>

        </tr>

        `;

    return;
  }

  data.forEach((category) => {
    tableBody.innerHTML += `

        <tr>

            <td>${category.category_id}</td>

            <td>${category.category_name}</td>

            <td>${category.description ?? ""}</td>

            <td>

                <span class="badge bg-${
                  category.status === "Active" ? "success" : "secondary"
                }">

                    ${category.status}

                </span>

            </td>

            <td>

                ${new Date(category.created_at).toLocaleDateString()}

            </td>

            <td>

                <button

                    class="btn btn-warning btn-sm"

                    onclick="editCategory(${category.category_id})">

                    <i class="fas fa-edit"></i>

                </button>

                <button

                    class="btn btn-danger btn-sm"

                    onclick="deleteCategory(${category.category_id})">

                    <i class="fas fa-trash"></i>

                </button>

            </td>

        </tr>

        `;
  });
}

// =============================================
// Search Categories
// =============================================

searchInput.addEventListener("keyup", () => {
  const keyword = searchInput.value.toLowerCase();

  const filtered = categories.filter(
    (category) =>
      category.category_name.toLowerCase().includes(keyword) ||
      (category.description || "").toLowerCase().includes(keyword),
  );

  renderTable(filtered);
});

// =============================================
// Logout
// =============================================

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("token");

  window.location.href = "../../login.html";
});

// =============================================
// Save Category
// =============================================

saveBtn.addEventListener("click", async () => {
  const data = {
    category_name: categoryName.value.trim(),
    description: description.value.trim(),
    status: status.value,
  };

  if (!data.category_name) {
    Swal.fire("Validation", "Category Name is required.", "warning");

    return;
  }

  try {
    let response;

    if (categoryId.value === "") {
      response = await fetch(API_URL, {
        method: "POST",

        headers,

        body: JSON.stringify(data),
      });
    } else {
      response = await fetch(
        `${API_URL}/${categoryId.value}`,

        {
          method: "PUT",

          headers,

          body: JSON.stringify(data),
        },
      );
    }

    const result = await response.json();

    if (!result.success) {
      Swal.fire(
        "Error",

        result.message || "Operation failed.",

        "error",
      );

      return;
    }

    Swal.fire(
      "Success",

      result.message,

      "success",
    );

    categoryModal.hide();

    resetForm();

    loadCategories();
  } catch (error) {
    console.error(error);

    Swal.fire(
      "Error",

      "Unable to save category.",

      "error",
    );
  }
});

// =============================================
// Edit Category
// =============================================

async function editCategory(id) {
  try {
    const response = await fetch(
      `${API_URL}/${id}`,

      {
        headers,
      },
    );

    const result = await response.json();

    if (!result.success) {
      Swal.fire(
        "Error",

        result.message,

        "error",
      );

      return;
    }

    const category = result.data;

    categoryId.value = category.category_id;

    categoryName.value = category.category_name;

    description.value = category.description || "";

    status.value = category.status;

    modalTitle.innerText = "Edit Category";

    categoryModal.show();
  } catch (error) {
    console.error(error);
  }
}

// =============================================
// Delete Category
// =============================================

async function deleteCategory(id) {
  const confirm = await Swal.fire({
    title: "Delete Category?",

    text: "This action cannot be undone.",

    icon: "warning",

    showCancelButton: true,

    confirmButtonText: "Delete",
  });

  if (!confirm.isConfirmed) return;

  try {
    const response = await fetch(
      `${API_URL}/${id}`,

      {
        method: "DELETE",

        headers,
      },
    );

    const result = await response.json();

    if (!result.success) {
      Swal.fire(
        "Error",

        result.message,

        "error",
      );

      return;
    }

    Swal.fire(
      "Deleted",

      result.message,

      "success",
    );

    loadCategories();
  } catch (error) {
    console.error(error);
  }
}

// =============================================
// Reset Form
// =============================================

function resetForm() {
  categoryId.value = "";

  categoryName.value = "";

  description.value = "";

  status.value = "Active";

  modalTitle.innerText = "Add Category";
}

// =============================================
// Modal Reset
// =============================================

document
  .getElementById("categoryModal")

  .addEventListener("hidden.bs.modal", resetForm);

// =============================================
// Initialize
// =============================================

loadCategories();
