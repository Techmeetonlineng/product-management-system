const categoryModel = require("../models/categoryModel");

// ======================================
// Create Category
// ======================================
async function createCategory(req, res) {

    try {

        const { category_name, description } = req.body;

        const result = await categoryModel.createCategory({
            category_name,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category_id: result.insertId
        });

    } catch (error) {

        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({
                success: false,
                message: "Category already exists."
            });

        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}
// ======================================
// Get All Categories
// ======================================
async function getAllCategories(req, res) {

    try {

        const categories = await categoryModel.getAllCategories();

        res.json({

            success: true,
            data: categories

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// ======================================
// Get Category By ID
// ======================================
async function getCategoryById(req, res) {

    try {

        const category = await categoryModel.getCategoryById(req.params.id);

        if (!category) {

            return res.status(404).json({

                success: false,
                message: "Category not found."

            });

        }

        res.json({

            success: true,
            data: category

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// ======================================
// Update Category
// ======================================
async function updateCategory(req, res) {

    try {

        const { category_name, description } = req.body;

        await categoryModel.updateCategory(

            req.params.id,

            {
                category_name,
                description
            }

        );

        res.json({

            success: true,
            message: "Category updated successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// ======================================
// Delete Category
// ======================================
async function deleteCategory(req, res) {

    try {

        await categoryModel.deleteCategory(req.params.id);

        res.json({

            success: true,
            message: "Category deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory

};