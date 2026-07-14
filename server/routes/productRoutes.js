const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ======================================
// Public Routes
// ======================================

router.get("/public", productController.getPublicProducts);

// ======================================
// Authentication
// ======================================

router.use(authenticate);

// ======================================
// Everyone Logged In
// ======================================

// Get Products
router.get("/", productController.getAllProducts);

// Get Single Product
router.get("/:id", productController.getProductById);

// ======================================
// Vendor Only
// ======================================

// Create Product
router.post(
  "/",
  authorize(2),
  upload.single("image"),
  productController.createProduct,
);

// Update Product
router.put(
  "/:id",
  authorize(2),
  upload.single("image"),
  productController.updateProduct,
);

// ======================================
// Administrator Only
// ======================================

// Approve Product
router.put("/:id/approve", authorize(1), productController.approveProduct);

// Reject Product
router.put("/:id/reject", authorize(1), productController.rejectProduct);

// Delete Product
router.delete("/:id", authorize(1), productController.deleteProduct);

module.exports = router;
