const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ======================================
// Admin-specific routes
// ======================================

// All routes below require authentication and admin role
router.use(authenticate);
router.use(authorize(1));

// Dashboard overview - could include additional admin-only statistics
router.get("/overview", (req, res) => {
    res.json({
        success: true,
        message: "Admin overview data",
        data: {
            // Admin-specific overview data would be populated here
        }
    });
});

// Admin-only actions are typically routed through specific endpoints:
// Products: use /api/products/:id/approve, /reject via productRoutes
// Categories: use /api/categories/* via categoryRoutes  
// Vendors: use /api/vendors/* via vendorRoutes

module.exports = router;
