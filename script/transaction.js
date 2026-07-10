const db = require("../server/config/database");

(async () => {

    const [rows] = await db.execute("SELECT @@autocommit AS autocommit");

    console.log(rows);

    process.exit();

})();