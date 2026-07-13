const categoryModel = require("../models/categoryModel");
const { validateCategory } = require("../validations/categoryValidation");

// ======================================
// Get All Categories
// ======================================

async function getAllCategories(req, res) {

    try {

        const categories = await categoryModel.getAllCategories();

        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve categories."
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

        return res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve category."
        });

    }

}

// ======================================
// Create Category
// ======================================

async function createCategory(req, res) {

    try {

        const errors = validateCategory(req.body);

        if (errors.length > 0) {

            return res.status(400).json({
                success: false,
                errors
            });

        }

        const exists = await categoryModel.findCategoryByName(
            req.body.category_name
        );

        if (exists) {

            return res.status(409).json({
                success: false,
                message: "Category already exists."
            });

        }

        const result = await categoryModel.createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category_id: result.insertId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to create category."
        });

    }

}

// ======================================
// Update Category
// ======================================

async function updateCategory(req, res) {

    try {

        const errors = validateCategory(req.body);

        if (errors.length > 0) {

            return res.status(400).json({
                success: false,
                errors
            });

        }

        const result = await categoryModel.updateCategory(
            req.params.id,
            req.body
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Category not found."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to update category."
        });

    }

}

// ======================================
// Delete Category
// ======================================

async function deleteCategory(req, res) {

    try {

        const result = await categoryModel.deleteCategory(req.params.id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Category not found."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete category."
        });

    }

}

module.exports = {

    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory

};