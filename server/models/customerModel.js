const pool = require("../config/database");

// ======================================
// Get All Customers
// ======================================
async function getAllCustomers() {

    const result = await pool.query(`
        SELECT
            user_id,
            first_name,
            last_name,
            email,
            phone,
            account_status,
            email_verified,
            created_at
        FROM users
        WHERE role_id = 3
        ORDER BY created_at DESC
    `);

    return result.rows;
}

// ======================================
// Get Customer By ID
// ======================================
async function getCustomerById(id) {

    const result = await pool.query(
        `
        SELECT
            user_id,
            first_name,
            last_name,
            email,
            phone,
            account_status,
            email_verified,
            created_at
        FROM users
        WHERE role_id = 3
        AND user_id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
}

// ======================================
// Search Customers
// ======================================
// Matches on name or email, case-insensitively (ILIKE), the same
// pattern used by categoryModel.findCategoryByName.
async function searchCustomers(keyword) {

    const result = await pool.query(
        `
        SELECT
            user_id,
            first_name,
            last_name,
            email,
            phone,
            account_status,
            email_verified,
            created_at
        FROM users
        WHERE role_id = 3
        AND (
            first_name ILIKE $1
            OR last_name ILIKE $1
            OR email ILIKE $1
            OR (first_name || ' ' || last_name) ILIKE $1
        )
        ORDER BY created_at DESC
        `,
        [`%${keyword}%`]
    );

    return result.rows;
}

// ======================================
// Filter Customers By Status
// ======================================
async function filterCustomers(status) {

    const result = await pool.query(
        `
        SELECT
            user_id,
            first_name,
            last_name,
            email,
            phone,
            account_status,
            email_verified,
            created_at
        FROM users
        WHERE role_id = 3
        AND account_status = $1
        ORDER BY created_at DESC
        `,
        [status]
    );

    return result.rows;
}

// ======================================
// Update Customer
// ======================================
async function updateCustomer(id, data) {

    const result = await pool.query(
        `
        UPDATE users
        SET
            first_name = $1,
            last_name = $2,
            phone = $3
        WHERE user_id = $4
        AND role_id = 3
        `,
        [
            data.first_name,
            data.last_name,
            data.phone,
            id
        ]
    );

    return result.rowCount;
}

// ======================================
// Update Customer Status
// ======================================
async function updateCustomerStatus(id, status, client = pool) {

    const result = await client.query(
        `
        UPDATE users
        SET account_status = $1
        WHERE user_id = $2
        AND role_id = 3
        `,
        [status, id]
    );

    return result.rowCount;
}

// ======================================
// Delete Customer
// ======================================
async function deleteCustomer(id) {

    const result = await pool.query(
        `
        DELETE FROM users
        WHERE user_id = $1
        AND role_id = 3
        `,
        [id]
    );

    return result.rowCount;
}

// ======================================
// Customer Statistics
// ======================================
async function getCustomerStats() {

    const result = await pool.query(`
        SELECT
            COUNT(*)::int AS total_customers,

            COUNT(*) FILTER (WHERE account_status = 'Approved')::int AS active,

            COUNT(*) FILTER (WHERE account_status = 'Pending')::int AS pending,

            COUNT(*) FILTER (WHERE account_status = 'Suspended')::int AS suspended

        FROM users
        WHERE role_id = 3
    `);

    return result.rows[0];
}

module.exports = {

    getAllCustomers,
    getCustomerById,
    searchCustomers,
    filterCustomers,
    updateCustomer,
    updateCustomerStatus,
    deleteCustomer,
    getCustomerStats

};
