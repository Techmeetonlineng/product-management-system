const db = require("../config/database");

// ======================================
// Find User By Email
// ======================================

async function findByEmail(email) {

    const [rows] = await db.query(

        `
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
        `,

        [email]

    );

    return rows[0];

}

// ======================================
// Create User
// ======================================

async function createUser(user) {

    const [result] = await db.query(

        `
        INSERT INTO users
        (
            role_id,
            first_name,
            last_name,
            email,
            phone,
            password,
            account_status
        )
        VALUES (?,?,?,?,?,?,?)
        `,

        [

            user.role_id,
            user.first_name,
            user.last_name,
            user.email,
            user.phone,
            user.password,
            user.account_status

        ]

    );

    return result;

}

// ======================================
// Find User By ID
// ======================================

async function findById(id){

    const [rows]=await db.query(

        `
        SELECT
        user_id,
        role_id,
        first_name,
        last_name,
        email,
        phone,
        account_status
        FROM users
        WHERE user_id=?
        `,

        [id]

    );

    return rows[0];

}

// ======================================
// Notification
// ======================================

async function createNotification(user_id,title,message){

    await db.query(

        `
        INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        VALUES (?,?,?)
        `,

        [

            user_id,
            title,
            message

        ]

    );

}

module.exports={

    findByEmail,
    createUser,
    findById,
    createNotification

};