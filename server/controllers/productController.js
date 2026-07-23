const productModel = require("../models/productModel");
const authModel = require("../models/authModel");
const pool = require("../config/database");
const { validateProduct } = require("../validations/productValidation");

// =====================================
// Create Product
// =====================================

async function createProduct(req, res) {
  try {
    // Vendor comes from authentication
    req.body.vendor_id = req.user.user_id;

    // Save uploaded image filename
    if (req.file) {
      req.body.image = req.file.path;
    }

    const { isValid, errors } = validateProduct(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const result = await productModel.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product_id: result.product_id,
    });
  } catch (error) {
    console.error("==================================");
    console.error("CREATE PRODUCT ERROR");
    console.error(error);
    console.error(error.stack);
    console.error("==================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================
// Get Public Products
// =====================================

async function getPublicProducts(req, res) {
  try {
    const products = await productModel.getPublicProducts();

    return res.json({
      success: true,

      count: products.length,

      data: products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Unable to retrieve public products.",
    });
  }
}

// =====================================
// Get All Products
// =====================================

async function getAllProducts(req, res) {
  try {
    const role = req.user.role_id;

    const products = await productModel.getAllProducts(role);

    return res.json({
      success: true,

      count: products.length,

      data: products,
    });
  } catch (error) {
    console.error("========== PRODUCT ERROR ==========");
    console.error(error);
    console.error(error.stack);
    console.error("===================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
// =====================================
// Get Product By ID
// =====================================

async function getProductById(req, res) {
  try {
    const product = await productModel.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve product.",
    });
  }
}

// =====================================
// Update Product
// =====================================

async function updateProduct(req, res) {
  try {
    // If a new image is uploaded
    if (req.file) {
      req.body.image = req.file.path;
    }

    const { isValid, errors } = validateProduct(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const result = await productModel.updateProduct(req.params.id, req.body);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================
// Approve Product
// =====================================

async function approveProduct(req, res) {
  try {
    const product = await productModel.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,

        message: "Product not found.",
      });
    }

    await pool.withTransaction(async (client) => {
      await productModel.approveProduct(req.params.id, client);

      await authModel.createNotification(
        product.vendor_id,

        "Product Approved",

        `${product.product_name} has been approved and is now visible on OnCampus Marketplace.`,

        client,
      );
    });

    return res.json({
      success: true,

      message: "Product approved successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Unable to approve product.",
    });
  }
}
// =====================================
// Reject Product
// =====================================

async function rejectProduct(req, res) {
  try {
    const product = await productModel.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,

        message: "Product not found.",
      });
    }

    await pool.withTransaction(async (client) => {
      await productModel.rejectProduct(req.params.id, client);

      await authModel.createNotification(
        product.vendor_id,

        "Product Rejected",

        `${product.product_name} was rejected by the Administrator.`,

        client,
      );
    });

    return res.json({
      success: true,

      message: "Product rejected successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Unable to reject product.",
    });
  }
}
// =====================================
// Delete Product
// =====================================

async function deleteProduct(req, res) {
  try {
    const product = await productModel.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Admin can delete anything
    if (req.user.role_id === 1) {
      await productModel.deleteProduct(req.params.id);

      return res.json({
        success: true,
        message: "Product deleted successfully.",
      });
    }

    // Vendor can delete only their own product
    if (req.user.role_id === 2 && product.vendor_id === req.user.user_id) {
      await productModel.deleteProduct(req.params.id);

      return res.json({
        success: true,
        message: "Product deleted successfully.",
      });
    }

    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this product.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete product.",
    });
  }
}

module.exports = {
  createProduct,
  getPublicProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  approveProduct,
  rejectProduct,
  deleteProduct,
};
