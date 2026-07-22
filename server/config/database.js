const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false,
  },

  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});
pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

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
