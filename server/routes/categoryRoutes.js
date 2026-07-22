const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/categoryController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ======================================
// Authentication
// ======================================

router.use(authenticate);

// ======================================
// Everyone Logged In
// ======================================

// Get All Categories
router.get(
    "/",
    categoryController.getAllCategories
);

// Get Category By ID
router.get(
    "/:id",
    categoryController.getCategoryById
);

// ======================================
// Administrator Only
// ======================================

// Create Category
router.post(
    "/",
    authorize(1),
    categoryController.createCategory
);

// Update Category
router.put(
    "/:id",
    authorize(1),
    categoryController.updateCategory
);

// Delete Category
router.delete(
    "/:id",
    authorize(1),
    categoryController.deleteCategory
);

module.exports = router;