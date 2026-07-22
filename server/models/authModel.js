const pool = require("../config/database");

// ======================================
// Find User By Email
// ======================================

async function findByEmail(email) {
  const result = await pool.query(
    `
        SELECT *
        FROM users
        WHERE email = $1
        LIMIT 1
        `,

    [email],
  );

  return result.rows[0] || null;
}

// ======================================
// Create User
// ======================================

async function createUser(user) {
  const result = await pool.query(
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
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
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

  return result.rows[0];
}

// ======================================
// Find User By ID
// ======================================

async function findById(id) {
  const result = await pool.query(
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
        WHERE user_id = $1
        `,

    [id],
  );

  return result.rows[0] || null;
}

// ======================================
// Save Password Reset Token
// ======================================

async function savePasswordResetToken(user_id, token, expiresAt) {
  await pool.query(
    `
        UPDATE users
        SET reset_token = $1, reset_token_expires_at = $2
        WHERE user_id = $3
        `,

    [token, expiresAt, user_id],
  );
}

// ======================================
// Find User By Reset Token
// ======================================

async function findUserByResetToken(token) {
  const result = await pool.query(
    `
        SELECT *
        FROM users
        WHERE reset_token = $1
        AND reset_token_expires_at > CURRENT_TIMESTAMP
        LIMIT 1
        `,

    [token],
  );

  return result.rows[0] || null;
}

// ======================================
// Update Password
// ======================================

async function updatePassword(user_id, hashedPassword) {
  await pool.query(
    `
        UPDATE users
        SET password = $1
        WHERE user_id = $2
        `,

    [hashedPassword, user_id],
  );
}

// ======================================
// Clear Password Reset Token
// ======================================

async function clearPasswordResetToken(user_id) {
  await pool.query(
    `
        UPDATE users
        SET reset_token = NULL,
        reset_token_expires_at = NULL
        WHERE user_id = $1
        `,

    [user_id],
  );
}

// ======================================
// Notification
// ======================================

async function createNotification(user_id, title, message, client = pool) {
  await client.query(
    `
        INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        VALUES ($1, $2, $3)
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
