const mysql = require("mysql2/promise");

// TEMPORARY HARD-CODED CONNECTION
// We will restore .env after confirming everything works.

const pool = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "@Ayoola002",
    database: "product_management_system",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;