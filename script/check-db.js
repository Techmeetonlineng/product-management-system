const db = require("../server/config/database");

(async () => {
    const [rows] = await db.query(`
        SELECT
            DATABASE() AS database_name,
            @@hostname AS host,
            @@port AS port
    `);

    console.log(rows);

    process.exit();
})();