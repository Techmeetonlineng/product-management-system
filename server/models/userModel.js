const db = require("../config/database");

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

    const [result] = await db.execute(

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
        VALUES (?, ?, ?, ?, ?, ?, ?)`,

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

    return result;

}

// =====================================
// Find User By Email
// =====================================
async function findUserByEmail(email) {

    const [rows] = await db.execute(

        `SELECT
            user_id,
            role_id,
            first_name,
            last_name,
            email,
            phone,
            password,
            account_status,
            created_at
        FROM users
        WHERE email = ?`,

        [email]

    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];

}

// =====================================
// Find User By ID
// =====================================
async function findUserById(id) {

    const [rows] = await db.execute(

        `SELECT
            user_id,
            role_id,
            first_name,
            last_name,
            email,
            phone,
            account_status
        FROM users
        WHERE user_id = ?`,

        [id]

    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];

}

// =====================================
// Get All Users
// =====================================
async function getAllUsers() {

    const [rows] = await db.execute(

        `SELECT
            user_id,
            role_id,
            first_name,
            last_name,
            email,
            phone,
            account_status,
            created_at
        FROM users
        ORDER BY created_at DESC`

    );

    return rows;

}

// =====================================
// Update Account Status
// =====================================
async function updateAccountStatus(user_id, status) {

    const [result] = await db.execute(

        `UPDATE users
        SET account_status = ?
        WHERE user_id = ?`,

        [
            status,
            user_id
        ]

    );

    return result;

}

module.exports = {

    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
    updateAccountStatus

};