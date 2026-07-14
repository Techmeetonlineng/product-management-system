const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

// ======================================
// Public Routes
// ======================================

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);

// Reset Password
router.post("/reset-password", authController.resetPassword);

// ======================================
// Protected Routes
// ======================================

// Current Logged-in User
router.get("/me", authenticate, authController.me);

module.exports = router;
