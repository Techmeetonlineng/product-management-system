require("dotenv").config();

const bcrypt = require("bcrypt");
const { Client } = require("pg");

(async () => {

    const client = new Client({

        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    });

    await client.connect();

    console.log("Connected to database.");

    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const vendorPassword = await bcrypt.hash("Vendor@123", 10);
    const customerPassword = await bcrypt.hash("Customer@123", 10);

    // Roles must exist before users (FK: users.role_id -> roles.role_id)
    await client.query(
        `INSERT INTO roles (role_id, role_name, description)
        VALUES
        (1, 'Administrator', 'System Administrator'),
        (2, 'Vendor', 'Marketplace Vendor'),
        (3, 'Customer', 'Marketplace Customer')
        ON CONFLICT (role_id) DO NOTHING`
    );

    await client.query(

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
        ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING`,
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

    await client.query(

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
        ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING`,
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

    await client.query(

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
        ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING`,
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

    await client.end();

})();
