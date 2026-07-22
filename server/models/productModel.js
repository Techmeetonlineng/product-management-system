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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;

  const result = await pool.query(sql, [
    product.vendor_id,
    product.category_id,
    product.product_name,
    product.description || "",
    product.sku || "",
    product.price,
    product.quantity,
    product.image || null,
    "Pending",
    product.product_status || "Available",
  ]);

  return result.rows[0];
}

// ==========================================
// Get Products
// ==========================================
// role_id === 3 (Customer) only sees approved, in-stock products.
// All other roles (Admin, Vendor) see the full catalog.

async function getAllProducts(role_id = 0) {
  let sql = `
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
    `;

  const params = [];

  if (role_id === 3) {
    sql += `
            WHERE
                p.approval_status = 'Approved'
            AND
                p.product_status = 'Available'
        `;
  }

  sql += ` ORDER BY p.product_id DESC`;

  const result = await pool.query(sql, params);

  return result.rows;
}

// ==========================================
// Get Public Products
// ==========================================

async function getPublicProducts() {
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
        WHERE p.approval_status = 'Approved'
        AND p.product_status = 'Available'
        ORDER BY p.product_id DESC
    `;

  const result = await pool.query(sql);
  return result.rows;
}

// ==========================================
// Get Product By ID
// ==========================================

async function getProductById(id, client = pool) {
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
        WHERE p.product_id = $1
    `;

  const result = await client.query(sql, [id]);

  return result.rows[0] || null;
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
                category_id = $1,
                product_name = $2,
                description = $3,
                sku = $4,
                price = $5,
                quantity = $6,
                image = $7,
                product_status = $8
            WHERE product_id = $9
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
      id,
    ];
  }

  // Update WITHOUT image
  else {
    sql = `
            UPDATE products
            SET
                category_id = $1,
                product_name = $2,
                description = $3,
                sku = $4,
                price = $5,
                quantity = $6,
                product_status = $7
            WHERE product_id = $8
        `;

    values = [
      product.category_id,
      product.product_name,
      product.description || "",
      product.sku || "",
      product.price,
      product.quantity,
      product.product_status,
      id,
    ];
  }

  const result = await pool.query(sql, values);

  return result.rowCount;
}

// ==========================================
// Approve Product
// ==========================================

async function approveProduct(id, client = pool) {
  const result = await client.query(
    `
        UPDATE products
        SET approval_status = 'Approved'
        WHERE product_id = $1
        `,

    [id],
  );

  return result.rowCount;
}

// ==========================================
// Reject Product
// ==========================================

async function rejectProduct(id, client = pool) {
  const result = await client.query(
    `
        UPDATE products
        SET approval_status = 'Rejected'
        WHERE product_id = $1
        `,

    [id],
  );

  return result.rowCount;
}

// ==========================================
// Delete Product
// ==========================================

async function deleteProduct(id) {
  const result = await pool.query(
    `
        DELETE FROM products
        WHERE product_id = $1
        `,

    [id],
  );

  return result.rowCount;
}

module.exports = {
  createProduct,
  getAllProducts,
  getPublicProducts,
  getProductById,
  updateProduct,
  approveProduct,
  rejectProduct,
  deleteProduct,
};
