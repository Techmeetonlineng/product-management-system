const express = require("express");

const router = express.Router();

const vendorController = require("../controllers/vendorController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// =====================================
// All Vendor Routes Require Login
// =====================================

router.use(authenticate);

// =====================================
// Administrator Only
// =====================================

router.use(authorize(1));

// =====================================
// Vendor Routes
// =====================================

// Vendor Statistics
router.get("/stats", vendorController.getVendorStats);

// Get All Vendors
router.get("/", vendorController.getAllVendors);

// Get Vendor By ID
router.get("/:id", vendorController.getVendorById);

// Approve Vendor
router.put("/:id/approve", vendorController.approveVendor);

// Reject Vendor
router.put("/:id/reject", vendorController.rejectVendor);

// Suspend Vendor
router.put("/:id/suspend", vendorController.suspendVendor);

module.exports = router;