require("dotenv").config();

const jwt = require("jsonwebtoken");

const token =
"MyVeryStrongSecretKey2026";

try {

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    console.log(decoded);

} catch(err){

    console.log(err);

}