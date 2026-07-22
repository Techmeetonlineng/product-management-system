const { Pool } = require("pg");
require("dotenv").config();

// ======================================================
// PostgreSQL Connection Pool (native)
// ======================================================
//
// This module exports a plain `pg.Pool` instance. All models call
// `pool.query(sql, params)` directly using native PostgreSQL syntax:
//
//   - "$1, $2, ..." positional placeholders (not "?")
//   - explicit "RETURNING <columns>" on INSERT statements to get the
//     newly created row back, instead of a MySQL-style `insertId`
//   - `result.rowCount` for UPDATE/DELETE affected-row counts, instead
//     of a MySQL-style `affectedRows`
//
// A previous revision of this file wrapped the pool in a mysql2-compatible
// shim (auto "?" -> "$n" conversion, `insertId`/`affectedRows` emulation)
// to make the initial MySQL -> PostgreSQL migration a drop-in swap. Now
// that every model and controller has been converted to native pg
// syntax, that compatibility layer has been removed - there is nothing
// left in the codebase that depends on it.

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
});

pool.on("error", (error) => {
  // Errors on idle clients (e.g. the DB restarting) should not crash
  // the whole process - log and let the pool reconnect on next use.
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

// ======================================================
// Transaction Helper
// ======================================================
//
// Wraps a sequence of queries in BEGIN / COMMIT, rolling back on any
// error, and always releasing the client back to the pool. Model
// functions that need to participate in a transaction accept an
// optional `client` parameter (defaulting to the shared `pool`), so
// they work identically whether called standalone or from inside a
// withTransaction() callback - see productModel.approveProduct /
// authModel.createNotification for the pattern.
//
// Usage:
//   await pool.withTransaction(async (client) => {
//     await productModel.approveProduct(id, client);
//     await authModel.createNotification(vendorId, title, msg, client);
//   });
async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}

pool.withTransaction = withTransaction;

pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("=================================");
    console.log("✅ PostgreSQL Connected Successfully");
    console.log("Database:", process.env.DB_NAME);
    console.log("=================================");
  })
  .catch((error) => {
    console.log("=================================");
    console.log("❌ PostgreSQL Connection Failed");
    console.log(error.message);
    console.log("=================================");
  });

module.exports = pool;
