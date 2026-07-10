const db = require("../server/config/database");

(async () => {
    try {
        const [rows] = await db.execute("SELECT * FROM users");

        console.log(rows);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit();
    }
})();