const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

const pool = require("./config/database");

// ======================================
// Import Routes
// ======================================

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

// ======================================

const app = express();

// ======================================
// App Information
// ======================================

console.log("=================================");
console.log(" Product Management System API");
console.log("=================================");
console.log("Current Directory:", __dirname);
console.log("Environment:", process.env.NODE_ENV || "development");
console.log("Database:", process.env.DB_NAME);
console.log("=================================");

// ======================================
// Middleware
// ======================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("dev"));

// ======================================
// Static Files
// ======================================

// Entire client folder
app.use(express.static(path.join(__dirname, "../client")));

// Assets
app.use(
    "/assets",
    express.static(path.join(__dirname, "../client/assets"))
);

// Pages
app.use(
    "/pages",
    express.static(path.join(__dirname, "../client/pages"))
);

// Images
app.use(
    "/images",
    express.static(path.join(__dirname, "../client/images"))
);

// Uploads
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ======================================
// API Routes
// ======================================

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/vendors", vendorRoutes);

console.log("✓ Auth Routes Loaded");
console.log("✓ Category Routes Loaded");
console.log("✓ Product Routes Loaded");
console.log("✓ Vendor Routes Loaded");

// ======================================
// Pages
// ======================================

// Login Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/login.html"));
});

// Dashboard Redirect
app.get("/admin/dashboard.html", (req, res) => {
    res.redirect("/pages/admin/dashboard.html");
});

app.get("/vendor/dashboard.html", (req, res) => {
    res.redirect("/pages/vendor/dashboard.html");
});

// ======================================
// Health Check
// ======================================

app.get("/health", async (req, res) => {

    try {

        await pool.query("SELECT 1");

        res.json({
            success: true,
            message: "Server is running.",
            database: "Connected"
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });

    }

});

// ======================================
// 404
// ======================================

app.use((req, res) => {

    res.status(404).json({

        success: false,
        message: "Route not found."

    });

});

// ======================================
// Error Handler
// ======================================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,
        message: err.message

    });

});

// ======================================
// Database Test
// ======================================

(async () => {

    try {

        const connection = await pool.getConnection();

        console.log("=================================");
        console.log("✅ Connected to MySQL Database");
        console.log("=================================");

        const [rows] = await connection.query(
            "SELECT DATABASE() AS db"
        );

        console.log(rows);

        connection.release();

    }

    catch (error) {

        console.log("=================================");
        console.log("❌ Database Connection Failed");
        console.log(error.message);
        console.log("=================================");

    }

})();

// ======================================
// Start Server
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("=================================");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("=================================");

});