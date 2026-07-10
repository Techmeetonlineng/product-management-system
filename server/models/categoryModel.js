const pool = require("../config/database");

// ======================================
// Create Category
// ======================================
async function createCategory(categoryData) {

    const { category_name, description } = categoryData;

    const [result] = await pool.query(

        `INSERT INTO categories
        (category_name, description)
        VALUES (?, ?)`,

        [category_name, description]

    );

    return result;

}

// ======================================
// Get All Categories
// ======================================
async function getAllCategories() {

    const [rows] = await pool.query(

        `SELECT *
         FROM categories
         ORDER BY category_id DESC`

    );

    return rows;

}

// ======================================
// Get Category By ID
// ======================================
async function getCategoryById(id) {

    const [rows] = await pool.query(

        `SELECT *
         FROM categories
         WHERE category_id = ?`,

        [id]

    );

    return rows[0];

}

// ======================================
// Update Category
// ======================================
async function updateCategory(id, categoryData) {

    const { category_name, description } = categoryData;

    const [result] = await pool.query(

        `UPDATE categories
         SET category_name = ?,
             description = ?
         WHERE category_id = ?`,

        [category_name, description, id]

    );

    return result;

}

// ======================================
// Delete Category
// ======================================
async function deleteCategory(id) {

    const [result] = await pool.query(

        `DELETE FROM categories
         WHERE category_id = ?`,

        [id]

    );

    return result;

}

module.exports = {

    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory

};