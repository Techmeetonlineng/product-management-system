// ======================================
// Admin Reports
// ======================================

requireRole(CONFIG.ROLES.ADMIN);

let categoryChartInstance = null;
let approvalChartInstance = null;
let vendorChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  loadReports();
  document.getElementById("refreshReports")?.addEventListener("click", loadReports);
});

// ======================================
// Load Reports
// ======================================

async function loadReports() {
  try {
    const [productsResult, categoriesResult, vendorStatsResult] = await Promise.all([
      API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST),
      API.get(CONFIG.API.ENDPOINTS.CATEGORIES.LIST),
      API.get(CONFIG.API.ENDPOINTS.VENDORS.STATS),
    ]);

    const products = productsResult.success ? productsResult.data : [];
    const categories = categoriesResult.success ? categoriesResult.data : [];
    const vendorStats = vendorStatsResult.success ? vendorStatsResult.data : null;

    renderStatCards(products, categories, vendorStats);
    renderCategoryChart(products, categories);
    renderApprovalChart(products);
    renderVendorChart(vendorStats);
    renderTopCategoriesTable(products, categories);
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to load reports.");
  }
}

// ======================================
// Stat Cards
// ======================================

function renderStatCards(products, categories, vendorStats) {
  document.getElementById("reportTotalProducts").textContent = products.length;
  document.getElementById("reportTotalCategories").textContent = categories.length;
  document.getElementById("reportTotalVendors").textContent = vendorStats?.total_vendors ?? 0;

  const pendingApprovals = products.filter((p) => p.approval_status === "Pending").length;
  document.getElementById("reportPendingApprovals").textContent = pendingApprovals;
}

// ======================================
// Products by Category
// ======================================

function countProductsByCategory(products, categories) {
  const counts = {};

  categories.forEach((category) => {
    counts[category.category_name] = 0;
  });

  products.forEach((product) => {
    const name = product.category_name || "Uncategorized";
    counts[name] = (counts[name] || 0) + 1;
  });

  return counts;
}

function renderCategoryChart(products, categories) {
  const counts = countProductsByCategory(products, categories);
  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const ctx = document.getElementById("categoryChart");
  if (categoryChartInstance) categoryChartInstance.destroy();

  categoryChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Products",
          data,
          backgroundColor: "#4f46e5",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

// ======================================
// Product Approval Status
// ======================================

function renderApprovalChart(products) {
  const statuses = ["Pending", "Approved", "Rejected"];
  const counts = statuses.map(
    (status) => products.filter((p) => p.approval_status === status).length,
  );

  const ctx = document.getElementById("approvalChart");
  if (approvalChartInstance) approvalChartInstance.destroy();

  approvalChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: statuses,
      datasets: [
        {
          data: counts,
          backgroundColor: ["#f59e0b", "#22c55e", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

// ======================================
// Vendor Account Status
// ======================================

function renderVendorChart(vendorStats) {
  const ctx = document.getElementById("vendorChart");
  if (vendorChartInstance) vendorChartInstance.destroy();

  const labels = ["Pending", "Approved", "Rejected", "Suspended"];
  const data = vendorStats
    ? [
        vendorStats.pending || 0,
        vendorStats.approved || 0,
        vendorStats.rejected || 0,
        vendorStats.suspended || 0,
      ]
    : [0, 0, 0, 0];

  vendorChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#f59e0b", "#22c55e", "#ef4444", "#334155"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

// ======================================
// Top Categories Table
// ======================================

function renderTopCategoriesTable(products, categories) {
  const counts = countProductsByCategory(products, categories);
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const tbody = document.getElementById("topCategoriesTable");
  tbody.innerHTML = "";

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2" class="text-center">No categories found.</td></tr>`;
    return;
  }

  rows.forEach(([name, count]) => {
    tbody.innerHTML += `
        <tr>
            <td>${name}</td>
            <td>${count}</td>
        </tr>
    `;
  });
}
