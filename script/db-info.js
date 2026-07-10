const db = require("../server/config/database");

(async () => {
    try {

        const [database] = await db.execute("SELECT DATABASE() AS db");
        console.log(database);

        const [hostname] = await db.execute("SELECT @@hostname AS host");
        console.log(hostname);

        const [port] = await db.execute("SELECT @@port AS port");
        console.log(port);

        const [version] = await db.execute("SELECT VERSION() AS version");
        console.log(version);

        const [users] = await db.execute("SELECT COUNT(*) AS total FROM users");
        console.log(users);

        process.exit();

    } catch (err) {
        console.log(err);
    }
})();