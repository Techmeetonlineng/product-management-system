const pool = require("../config/database");

// ======================================
// Get All Vendors
// ======================================
async function getAllVendors() {

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
        WHERE role_id = 2
        ORDER BY created_at DESC
    `);

    return result.rows;
}

// ======================================
// Get Vendor By ID
// ======================================
async function getVendorById(id) {

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
        WHERE role_id = 2
        AND user_id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
}

// ======================================
// Approve Vendor
// ======================================
async function approveVendor(id, client = pool) {

    const result = await client.query(
        `
        UPDATE users
        SET account_status = 'Approved'
        WHERE user_id = $1
        AND role_id = 2
        `,
        [id]
    );

    return result.rowCount;
}

// ======================================
// Reject Vendor
// ======================================
async function rejectVendor(id) {

    const result = await pool.query(
        `
        UPDATE users
        SET account_status = 'Rejected'
        WHERE user_id = $1
        AND role_id = 2
        `,
        [id]
    );

    return result.rowCount;
}

// ======================================
// Suspend Vendor
// ======================================
async function suspendVendor(id) {

    const result = await pool.query(
        `
        UPDATE users
        SET account_status = 'Suspended'
        WHERE user_id = $1
        AND role_id = 2
        `,
        [id]
    );

    return result.rowCount;
}

// ======================================
// Vendor Statistics
// ======================================
async function getVendorStats() {

    const result = await pool.query(`
        SELECT
            COUNT(*)::int AS total_vendors,

            COUNT(*) FILTER (WHERE account_status = 'Pending')::int AS pending,

            COUNT(*) FILTER (WHERE account_status = 'Approved')::int AS approved,

            COUNT(*) FILTER (WHERE account_status = 'Rejected')::int AS rejected,

            COUNT(*) FILTER (WHERE account_status = 'Suspended')::int AS suspended

        FROM users
        WHERE role_id = 2
    `);

    return result.rows[0];
}

module.exports = {

    getAllVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    suspendVendor,
    getVendorStats

};
