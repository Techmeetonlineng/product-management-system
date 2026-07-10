require("dotenv").config();

const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

(async () => {

    const connection = await mysql.createConnection({

        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    });

    console.log("Connected to database.");

    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const vendorPassword = await bcrypt.hash("Vendor@123", 10);
    const customerPassword = await bcrypt.hash("Customer@123", 10);

    await connection.execute(

        `INSERT INTO users
        (
            role_id,
            first_name,
            last_name,
            email,
            phone,
            password,
            account_status,
            email_verified
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            1,
            "System",
            "Administrator",
            "admin@pms.com",
            "08000000000",
            adminPassword,
            "Approved",
            true
        ]

    );

    await connection.execute(

        `INSERT INTO users
        (
            role_id,
            first_name,
            last_name,
            email,
            phone,
            password,
            account_status,
            email_verified
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            2,
            "John",
            "Vendor",
            "vendor@pms.com",
            "08011111111",
            vendorPassword,
            "Approved",
            true
        ]

    );

    await connection.execute(

        `INSERT INTO users
        (
            role_id,
            first_name,
            last_name,
            email,
            phone,
            password,
            account_status,
            email_verified
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            3,
            "James",
            "Customer",
            "customer@pms.com",
            "08022222222",
            customerPassword,
            "Approved",
            true
        ]

    );

    console.log("Users inserted successfully.");

    await connection.end();

})();