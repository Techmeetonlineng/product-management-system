require("dotenv").config();

const { Client } = require("pg");

(async () => {
    try {

        const client = new Client({
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || "postgres",

            // Replace ONLY this line with your REAL password
            password: process.env.DB_PASSWORD,

            database: process.env.DB_NAME || "product_management_system"
        });

        await client.connect();

        console.log("✅ Connected Successfully!");

        const result = await client.query("SELECT 1");

        console.log(result.rows);

        await client.end();

    } catch (error) {

        console.error(error);

    }
})();
