const bcrypt = require("bcrypt");
const db = require("../server/config/database");

(async () => {
    const [rows] = await db.execute(
        "SELECT password FROM users WHERE email = ?",
        ["admin@pms.com"]
    );

    console.log("Hash from DB:");
    console.log(rows[0].password);

    const result = await bcrypt.compare(
        "Admin@123",
        rows[0].password
    );

    console.log("Password Match:", result);

    process.exit();
})();