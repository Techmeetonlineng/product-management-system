const pool = require("../config/database");

// ======================================
// Get All Categories
// ======================================

async function getAllCategories() {

    const result = await pool.query(

        `
        SELECT
            category_id,
            category_name,
            description,
            status,
            created_at
        FROM categories
        ORDER BY category_name ASC
        `

    );

    return result.rows;

}

// ======================================
// Get Category By ID
// ======================================

async function getCategoryById(id) {

    const result = await pool.query(

        `
        SELECT
            category_id,
            category_name,
            description,
            status,
            created_at
        FROM categories
        WHERE category_id = $1
        `,
        [id]

    );

    return result.rows[0] || null;

}

// ======================================
// Create Category
// ======================================

async function createCategory(data) {

    const result = await pool.query(

        `
        INSERT INTO categories
        (
            category_name,
            description,
            status
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
            data.category_name,
            data.description,
            data.status || "Active"
        ]

    );

    return result.rows[0];

}

// ======================================
// Update Category
// ======================================

async function updateCategory(id, data) {

    const result = await pool.query(

        `
        UPDATE categories
        SET
            category_name = $1,
            description = $2,
            status = $3
        WHERE category_id = $4
        `,
        [
            data.category_name,
            data.description,
            data.status,
            id
        ]

    );

    return result.rowCount;

}

// ======================================
// Delete Category
// ======================================

async function deleteCategory(id) {

    const result = await pool.query(

        `
        DELETE FROM categories
        WHERE category_id = $1
        `,
        [id]

    );

    return result.rowCount;

}

// ======================================
// Check Existing Category
// ======================================

async function findCategoryByName(name) {

    const result = await pool.query(

        `
        SELECT *
        FROM categories
        WHERE category_name ILIKE $1
        `,
        [name]

    );

    return result.rows[0] || null;

}

module.exports = {

    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    findCategoryByName

};
