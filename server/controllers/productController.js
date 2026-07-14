const productModel = require("../models/productModel");

// =====================================
// Create Product
// =====================================

async function createProduct(req, res) {
  try {
    // Vendor comes from authentication
    req.body.vendor_id = req.user.user_id;

    // Save uploaded image filename
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const result = await productModel.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to create product.",
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
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Unable to retrieve products.",
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
      req.body.image = req.file.filename;
    }

    const result = await productModel.updateProduct(req.params.id, req.body);

    if (result.affectedRows === 0) {
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

    return res.status(500).json({
      success: false,
      message: "Unable to update product.",
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

    await productModel.approveProduct(req.params.id);

    const authModel = require("../models/authModel");

    await authModel.createNotification(
      product.vendor_id,

      "Product Approved",

      `${product.product_name} has been approved and is now visible on OnCampus Marketplace.`,
    );

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

    await productModel.rejectProduct(req.params.id);

    const authModel = require("../models/authModel");

    await authModel.createNotification(
      product.vendor_id,

      "Product Rejected",

      `${product.product_name} was rejected by the Administrator.`,
    );

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
    const result = await productModel.deleteProduct(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
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
