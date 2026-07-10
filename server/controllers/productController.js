const productModel = require("../models/productModel");

// =====================================
// Create Product
// =====================================
async function createProduct(req, res) {

    try {

        // Temporary vendor until authentication middleware is added
        req.body.vendor_id = 2;

        const result = await productModel.createProduct(req.body);

        return res.status(201).json({

            success: true,
            message: "Product created successfully.",
            product_id: result.insertId

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// =====================================
// Get All Products
// =====================================
async function getAllProducts(req, res) {

    try {

        const products = await productModel.getAllProducts();

        return res.json({

            success: true,
            count: products.length,
            data: products

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

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
                message: "Product not found."

            });

        }

        return res.json({

            success: true,
            data: product

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// =====================================
// Update Product
// =====================================
async function updateProduct(req, res) {

    try {

        const result = await productModel.updateProduct(

            req.params.id,
            req.body

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,
                message: "Product not found."

            });

        }

        return res.json({

            success: true,
            message: "Product updated successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

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
                message: "Product not found."

            });

        }

        return res.json({

            success: true,
            message: "Product deleted successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct

};