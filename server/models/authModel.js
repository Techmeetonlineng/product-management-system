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

    [email],
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
      user.account_status,
    ],
  );

  return result;
}

// ======================================
// Find User By ID
// ======================================

async function findById(id) {
  const [rows] = await db.query(
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

    [id],
  );

  return rows[0];
}

// ======================================
// Save Password Reset Token
// ======================================

async function savePasswordResetToken(user_id, token, expiresAt) {
  await db.query(
    `
        UPDATE users
        SET reset_token = ?, reset_token_expires_at = ?
        WHERE user_id = ?
        `,

    [token, expiresAt, user_id],
  );
}

// ======================================
// Find User By Reset Token
// ======================================

async function findUserByResetToken(token) {
  const [rows] = await db.query(
    `
        SELECT *
        FROM users
        WHERE reset_token = ?
        AND reset_token_expires_at > NOW()
        LIMIT 1
        `,

    [token],
  );

  return rows[0];
}

// ======================================
// Update Password
// ======================================

async function updatePassword(user_id, hashedPassword) {
  await db.query(
    `
        UPDATE users
        SET password = ?
        WHERE user_id = ?
        `,

    [hashedPassword, user_id],
  );
}

// ======================================
// Clear Password Reset Token
// ======================================

async function clearPasswordResetToken(user_id) {
  await db.query(
    `
        UPDATE users
        SET reset_token = NULL,
        reset_token_expires_at = NULL
        WHERE user_id = ?
        `,

    [user_id],
  );
}

// ======================================
// Notification
// ======================================

async function createNotification(user_id, title, message) {
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

    [user_id, title, message],
  );
}

module.exports = {
  findByEmail,
  createUser,
  findById,
  savePasswordResetToken,
  findUserByResetToken,
  updatePassword,
  clearPasswordResetToken,
  createNotification,
};
