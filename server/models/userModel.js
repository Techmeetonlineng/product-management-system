const pool = require("../config/database");

// =====================================
// Create User
// =====================================
async function createUser(userData) {

    const {
        role_id,
        first_name,
        last_name,
        email,
        phone,
        password,
        account_status
    } = userData;

    const result = await pool.query(

        `INSERT INTO users
        (
            role_id,
            first_name,
            last_name,
            email,
            phone,
            password,
            account_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,

        [
            role_id,
            first_name,
            last_name,
            email,
            phone,
            password,
            account_status
        ]

    );

    return result.rows[0];

}

// =====================================
// Find User By Email
// =====================================
async function findUserByEmail(email) {

    const result = await pool.query(

        `SELECT
            user_id,
            role_id,
            first_name,
            last_name,
            email,
            phone,
            password,
            account_status,
            email_verified,
            created_at
        FROM users
        WHERE email = $1`,

        [email]

    );

    return result.rows[0] || null;

}

// =====================================
// Find User By ID
// =====================================
async function findUserById(id) {

    const result = await pool.query(

        `SELECT
            user_id,
            role_id,
            first_name,
            last_name,
            email,
            phone,
            account_status,
            email_verified,
            created_at
        FROM users
        WHERE user_id = $1`,

        [id]

    );

    return result.rows[0] || null;

}

// =====================================
// Get All Users
// =====================================
async function getAllUsers() {

    const result = await pool.query(

        `SELECT
            user_id,
            role_id,
            first_name,
            last_name,
            email,
            phone,
            account_status,
            email_verified,
            created_at
        FROM users
        ORDER BY created_at DESC`

    );

    return result.rows;

}

// =====================================
// Get Pending Vendors
// =====================================
async function getPendingVendors() {

    const result = await pool.query(

        `SELECT
            user_id,
            first_name,
            last_name,
            email,
            phone,
            account_status,
            created_at
        FROM users
        WHERE role_id = 2
        AND account_status = 'Pending'
        ORDER BY created_at ASC`

    );

    return result.rows;

}

// =====================================
// Update Account Status
// =====================================
async function updateAccountStatus(user_id, status) {

    const result = await pool.query(

        `UPDATE users
        SET account_status = $1
        WHERE user_id = $2`,

        [
            status,
            user_id
        ]

    );

    return result.rowCount;

}

// =====================================
// Delete User
// =====================================
async function deleteUser(user_id) {

    const result = await pool.query(

        `DELETE FROM users
        WHERE user_id = $1`,

        [user_id]

    );

    return result.rowCount;

}

module.exports = {

    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
    getPendingVendors,
    updateAccountStatus,
    deleteUser

};
