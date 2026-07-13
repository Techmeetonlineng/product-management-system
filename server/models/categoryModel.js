const db = require("../config/database");

// ======================================
// Get All Categories
// ======================================

async function getAllCategories() {

    const [rows] = await db.execute(

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

    return rows;

}

// ======================================
// Get Category By ID
// ======================================

async function getCategoryById(id) {

    const [rows] = await db.execute(

        `
        SELECT
            category_id,
            category_name,
            description,
            status,
            created_at
        FROM categories
        WHERE category_id = ?
        `,
        [id]

    );

    return rows.length ? rows[0] : null;

}

// ======================================
// Create Category
// ======================================

async function createCategory(data) {

    const [result] = await db.execute(

        `
        INSERT INTO categories
        (
            category_name,
            description,
            status
        )
        VALUES (?, ?, ?)
        `,
        [
            data.category_name,
            data.description,
            data.status || "Active"
        ]

    );

    return result;

}

// ======================================
// Update Category
// ======================================

async function updateCategory(id, data) {

    const [result] = await db.execute(

        `
        UPDATE categories
        SET
            category_name = ?,
            description = ?,
            status = ?
        WHERE category_id = ?
        `,
        [
            data.category_name,
            data.description,
            data.status,
            id
        ]

    );

    return result;

}

// ======================================
// Delete Category
// ======================================

async function deleteCategory(id) {

    const [result] = await db.execute(

        `
        DELETE FROM categories
        WHERE category_id = ?
        `,
        [id]

    );

    return result;

}

// ======================================
// Check Existing Category
// ======================================

async function findCategoryByName(name) {

    const [rows] = await db.execute(

        `
        SELECT *
        FROM categories
        WHERE category_name = ?
        `,
        [name]

    );

    return rows.length ? rows[0] : null;

}

module.exports = {

    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    findCategoryByName

};