const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    namedPlaceholders: true
});

pool.getConnection()
    .then(connection => {
        console.log("=================================");
        console.log("✅ MySQL Connected Successfully");
        console.log("Database:", process.env.DB_NAME);
        console.log("=================================");
        connection.release();
    })
    .catch(error => {
        console.log("=================================");
        console.log("❌ MySQL Connection Failed");
        console.log(error.message);
        console.log("=================================");
    });

module.exports = pool;