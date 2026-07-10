const db = require("../server/config/database");

(async () => {
    const [rows] = await db.execute("SELECT CURRENT_USER() AS user");

    console.log(rows);

    process.exit();
})();