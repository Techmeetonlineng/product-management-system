const db = require("../config/database");

// ======================================
// Get All Vendors
// ======================================
async function getAllVendors() {

    const [rows] = await db.execute(`
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

    return rows;
}

// ======================================
// Get Vendor By ID
// ======================================
async function getVendorById(id) {

    const [rows] = await db.execute(
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
        AND user_id = ?
        `,
        [id]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

// ======================================
// Approve Vendor
// ======================================
async function approveVendor(id) {

    const [result] = await db.execute(
        `
        UPDATE users
        SET account_status='Approved'
        WHERE user_id=?
        AND role_id=2
        `,
        [id]
    );

    return result;
}

// ======================================
// Reject Vendor
// ======================================
async function rejectVendor(id) {

    const [result] = await db.execute(
        `
        UPDATE users
        SET account_status='Rejected'
        WHERE user_id=?
        AND role_id=2
        `,
        [id]
    );

    return result;
}

// ======================================
// Suspend Vendor
// ======================================
async function suspendVendor(id) {

    const [result] = await db.execute(
        `
        UPDATE users
        SET account_status='Suspended'
        WHERE user_id=?
        AND role_id=2
        `,
        [id]
    );

    return result;
}

// ======================================
// Vendor Statistics
// ======================================
async function getVendorStats() {

    const [rows] = await db.execute(`
        SELECT
            COUNT(*) AS total_vendors,

            SUM(account_status='Pending') AS pending,

            SUM(account_status='Approved') AS approved,

            SUM(account_status='Rejected') AS rejected,

            SUM(account_status='Suspended') AS suspended

        FROM users
        WHERE role_id = 2
    `);

    return rows[0];
}

module.exports = {

    getAllVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    suspendVendor,
    getVendorStats

};