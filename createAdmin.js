const bcrypt = require("bcrypt");
const db = require("./server/config/database");

(async () => {
    try {

        const password = await bcrypt.hash("Admin@123", 10);

        await db.execute(
            `UPDATE users
             SET password = ?
             WHERE email = ?`,
            [password, "admin@pms.com"]
        );

        console.log("Admin password updated.");
        console.log(password);

        process.exit();

    } catch (err) {
        console.error(err);
        process.exit();
    }
})();