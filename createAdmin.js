const bcrypt = require("bcrypt");
const pool = require("./server/config/database");

(async () => {
  try {
    const password = await bcrypt.hash("Admin@123", 10);

    await pool.query(
      `UPDATE users
             SET password = $1
             WHERE email = $2`,
      [password, "admin@pms.com"],
    );

    console.log("Admin password updated.");
    console.log(password);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
})();
