const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// All routes require Admin
router.use(authenticate);
router.use(authorize(1));

// Statistics
router.get("/stats", customerController.getCustomerStats);

// Search
router.get("/search", customerController.searchCustomers);

// Filter
router.get("/filter", customerController.filterCustomers);

// Get all customers
router.get("/", customerController.getAllCustomers);

// Get single customer
router.get("/:id", customerController.getCustomerById);

// Update customer
router.put("/:id", customerController.updateCustomer);

// Suspend / Activate
router.patch("/:id/status", customerController.updateCustomerStatus);

// Delete
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
