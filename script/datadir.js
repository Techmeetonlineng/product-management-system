const db = require("../server/config/database");

(async () => {

    const [rows] = await db.execute(
        "SHOW VARIABLES LIKE 'datadir'"
    );

    console.log(rows);

    process.exit();

})();