const pool = require("../config/database");

// ==========================================
// Create Product
// ==========================================
async function createProduct(product) {

    const sql = `
        INSERT INTO products
        (
            vendor_id,
            category_id,
            product_name,
            description,
            sku,
            price,
            quantity,
            approval_status,
            product_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [

        product.vendor_id,
        product.category_id,
        product.product_name,
        product.description,
        product.sku,
        product.price,
        product.quantity,
        product.approval_status || "Pending",
        product.product_status || "Available"

    ]);

    return result;

}

// ==========================================
// Get All Products
// ==========================================
async function getAllProducts() {

    const sql = `
        SELECT
            p.*,
            c.category_name,
            u.first_name,
            u.last_name
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.category_id
        INNER JOIN users u
            ON p.vendor_id = u.user_id
        ORDER BY p.product_id DESC
    `;

    const [rows] = await pool.query(sql);

    return rows;

}

// ==========================================
// Get Product By ID
// ==========================================
async function getProductById(id) {

    const sql = `
        SELECT
            p.*,
            c.category_name,
            u.first_name,
            u.last_name
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.category_id
        INNER JOIN users u
            ON p.vendor_id = u.user_id
        WHERE p.product_id = ?
    `;

    const [rows] = await pool.query(sql, [id]);

    return rows[0];

}

// ==========================================
// Update Product
// ==========================================
async function updateProduct(id, product) {

    const sql = `
        UPDATE products
        SET
            category_id=?,
            product_name=?,
            description=?,
            sku=?,
            price=?,
            quantity=?,
            approval_status=?,
            product_status=?
        WHERE product_id=?
    `;

    const [result] = await pool.query(sql, [

        product.category_id,
        product.product_name,
        product.description,
        product.sku,
        product.price,
        product.quantity,
        product.approval_status,
        product.product_status,
        id

    ]);

    return result;

}

// ==========================================
// Delete Product
// ==========================================
async function deleteProduct(id) {

    const [result] = await pool.query(

        "DELETE FROM products WHERE product_id=?",

        [id]

    );

    return result;

}

module.exports = {

    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct

};