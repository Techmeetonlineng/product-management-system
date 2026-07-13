const bcrypt = require("bcrypt");

(async () => {
    console.log("Admin Password: admin123");
    console.log(await bcrypt.hash("admin123", 10));
})();



(async () => {
    console.log("Vendor Password: vendor123");
    console.log(await bcrypt.hash("vendor123", 10));
})();