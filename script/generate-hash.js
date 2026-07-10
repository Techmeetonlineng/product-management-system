const bcrypt = require("bcrypt");

(async () => {

    console.log("Admin:");
    console.log(await bcrypt.hash("Admin@123",10));

    console.log("");

    console.log("Vendor:");
    console.log(await bcrypt.hash("Vendor@123",10));

    console.log("");

    console.log("Customer:");
    console.log(await bcrypt.hash("Customer@123",10));

})();