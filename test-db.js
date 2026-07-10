const mysql = require("mysql2/promise");

(async () => {
    try {

        const connection = await mysql.createConnection({
            host: "127.0.0.1",
            port: 3306,
            user: "root",

            // Replace ONLY this line with your REAL password
            password: "@Ayoola002",

            database: "product_management_system"
        });

        console.log("✅ Connected Successfully!");

        const [rows] = await connection.query("SELECT 1");

        console.log(rows);

        await connection.end();

    } catch (error) {

        console.error(error);

    }
})();