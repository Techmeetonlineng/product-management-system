const customerModel = require("../models/customerModel");

// Statuses a customer account can actually be moved between.
// Customers are auto-approved at registration (see authController.register),
// so "Pending"/"Rejected" don't apply to an existing account the way they
// do for vendors - only Approved (active) <-> Suspended make sense here.
const ALLOWED_CUSTOMER_STATUSES = ["Approved", "Suspended"];

// ======================================
// Get All Customers
// ======================================
async function getAllCustomers(req, res) {
  try {
    const customers = await customerModel.getAllCustomers();

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customers.",
    });
  }
}

// ======================================
// Get Customer By ID
// ======================================
async function getCustomerById(req, res) {
  try {
    const customer = await customerModel.getCustomerById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customer.",
    });
  }
}

// ======================================
// Search Customers
// ======================================
async function searchCustomers(req, res) {
  try {
    const keyword = (req.query.q || "").trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword (q) is required.",
      });
    }

    const customers = await customerModel.searchCustomers(keyword);

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to search customers.",
    });
  }
}

// ======================================
// Filter Customers By Status
// ======================================
async function filterCustomers(req, res) {
  try {
    const status = req.query.status;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status query parameter is required.",
      });
    }

    const customers = await customerModel.filterCustomers(status);

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to filter customers.",
    });
  }
}

// ======================================
// Update Customer
// ======================================
async function updateCustomer(req, res) {
  try {
    const { first_name, last_name, phone } = req.body;

    if (!first_name || !first_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "First name is required.",
      });
    }

    if (!last_name || !last_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Last name is required.",
      });
    }

    const result = await customerModel.updateCustomer(req.params.id, {
      first_name,
      last_name,
      phone,
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to update customer.",
    });
  }
}

// ======================================
// Update Customer Status
// (covers both Activate and Suspend)
// ======================================
async function updateCustomerStatus(req, res) {
  try {
    const { status } = req.body;

    if (!status || !ALLOWED_CUSTOMER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_CUSTOMER_STATUSES.join(", ")}.`,
      });
    }

    const result = await customerModel.updateCustomerStatus(
      req.params.id,
      status,
    );

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        status === "Suspended"
          ? "Customer suspended successfully."
          : "Customer activated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to update customer status.",
    });
  }
}

// ======================================
// Delete Customer
// ======================================
async function deleteCustomer(req, res) {
  try {
    const result = await customerModel.deleteCustomer(req.params.id);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete customer.",
    });
  }
}

// ======================================
// Customer Statistics
// ======================================
async function getCustomerStats(req, res) {
  try {
    const stats = await customerModel.getCustomerStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve customer statistics.",
    });
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  searchCustomers,
  filterCustomers,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  getCustomerStats,
};
