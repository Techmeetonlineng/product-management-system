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
            image,
            approval_status,
            product_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [

        product.vendor_id,
        product.category_id,
        product.product_name,
        product.description || "",
        product.sku || "",
        product.price,
        product.quantity,
        product.image || null,
        "Pending",
        product.product_status || "Available"

    ]);

    return result;

}

// ==========================================
// Get All Products
// ==========================================

// ==========================================
// Get Products
// ==========================================

async function getAllProducts(role_id = 0) {

    let sql = `
        SELECT
            p.*,
            c.category_name,
            u.first_name,
            u.last_name
        FROM products p
        INNER JOIN categories c
            ON p.category_id=c.category_id
        INNER JOIN users u
            ON p.vendor_id=u.user_id
    `;

    // Customer
    if (role_id === 3) {

        sql += `
            WHERE
                p.approval_status='Approved'
            AND
                p.product_status='Available'
        `;

    }

    sql += ` ORDER BY p.product_id DESC`;

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

    let sql;
    let values;

    // Update WITH image
    if (product.image) {

        sql = `
            UPDATE products
            SET
                category_id=?,
                product_name=?,
                description=?,
                sku=?,
                price=?,
                quantity=?,
                image=?,
                product_status=?
            WHERE product_id=?
        `;

        values = [

            product.category_id,
            product.product_name,
            product.description || "",
            product.sku || "",
            product.price,
            product.quantity,
            product.image,
            product.product_status,
            id

        ];

    }

    // Update WITHOUT image
    else {

        sql = `
            UPDATE products
            SET
                category_id=?,
                product_name=?,
                description=?,
                sku=?,
                price=?,
                quantity=?,
                product_status=?
            WHERE product_id=?
        `;

        values = [

            product.category_id,
            product.product_name,
            product.description || "",
            product.sku || "",
            product.price,
            product.quantity,
            product.product_status,
            id

        ];

    }

    const [result] = await pool.query(sql, values);

    return result;

}

// ==========================================
// Approve Product
// ==========================================

async function approveProduct(id) {

    const [result] = await pool.query(

        `
        UPDATE products
        SET approval_status='Approved'
        WHERE product_id=?
        `,

        [id]

    );

    return result;

}

// ==========================================
// Reject Product
// ==========================================

async function rejectProduct(id) {

    const [result] = await pool.query(

        `
        UPDATE products
        SET approval_status='Rejected'
        WHERE product_id=?
        `,

        [id]

    );

    return result;

}

// ==========================================
// Delete Product
// ==========================================

async function deleteProduct(id) {

    const [result] = await pool.query(

        `
        DELETE FROM products
        WHERE product_id=?
        `,

        [id]

    );

    return result;

}

module.exports = {

    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    approveProduct,
    rejectProduct,
    deleteProduct

};