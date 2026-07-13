// ======================================
// Vendor Management
// ======================================

requireRole(CONFIG.ROLES.ADMIN);

document.addEventListener("DOMContentLoaded", loadVendors);

// ======================================
// Load Vendors
// ======================================

async function loadVendors() {
    try {
        const result = await API.get(CONFIG.API.ENDPOINTS.VENDORS.LIST);

        if (!result.success) {
            showError("Error", result.message);
            return;
        }

        renderVendors(result.data);
    } catch (error) {
        console.error(error);
        showError("Error", "Unable to load vendors.");
    }
}

// ======================================
// Render Vendors
// ======================================

function renderVendors(vendors) {
    const table = document.getElementById("vendorTable");
    table.innerHTML = "";

    if (vendors.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    No vendors found.
                </td>
            </tr>
        `;
        return;
    }

    vendors.forEach(vendor => {
        const badgeClass = getStatusBadgeClass(vendor.account_status);

        table.innerHTML += `
        <tr>
            <td>${vendor.user_id}</td>
            <td>${vendor.first_name} ${vendor.last_name}</td>
            <td>${vendor.email}</td>
            <td>${vendor.phone ?? ""}</td>
            <td>
                <span class="badge bg-${badgeClass}">
                    ${vendor.account_status}
                </span>
            </td>
            <td>
                <button class="btn btn-success btn-sm" onclick="approveVendor(${vendor.user_id})" title="Approve">
                    <i class="fa fa-check"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectVendor(${vendor.user_id})" title="Reject">
                    <i class="fa fa-times"></i>
                </button>
                <button class="btn btn-dark btn-sm" onclick="suspendVendor(${vendor.user_id})" title="Suspend">
                    <i class="fa fa-ban"></i>
                </button>
            </td>
        </tr>
        `;
    });
}

// ======================================
// Approve Vendor
// ======================================

async function approveVendor(id) {
    try {
        const result = await API.put(CONFIG.API.ENDPOINTS.VENDORS.APPROVE(id), {});

        showSuccess("Success", result.message);
        loadVendors();
    } catch (error) {
        console.error(error);
        showError("Error", "Unable to approve vendor.");
    }
}

// ======================================
// Reject Vendor
// ======================================

async function rejectVendor(id) {
    try {
        const result = await API.put(CONFIG.API.ENDPOINTS.VENDORS.REJECT(id), {});

        showError("Rejected", result.message);
        loadVendors();
    } catch (error) {
        console.error(error);
        showError("Error", "Unable to reject vendor.");
    }
}

// ======================================
// Suspend Vendor
// ======================================

async function suspendVendor(id) {
    try {
        const result = await API.put(CONFIG.API.ENDPOINTS.VENDORS.SUSPEND(id), {});

        showWarning("Suspended", result.message);
        loadVendors();
    } catch (error) {
        console.error(error);
        showError("Error", "Unable to suspend vendor.");
    }
}