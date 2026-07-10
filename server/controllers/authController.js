const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const { validateRegister } = require("../validations/authValidation");
const { generateToken } = require("../utils/jwt");

// ======================================
// Register
// ======================================

async function register(req, res) {

    try {

        const errors = validateRegister(req.body);

        if (errors.length > 0) {

            return res.status(400).json({
                success: false,
                errors
            });

        }

        const existingUser = await userModel.findUserByEmail(req.body.email);

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });

        }

        let role_id = 3;
        let account_status = "Approved";

        // Vendor Registration
        if (req.body.role === "Vendor") {

            role_id = 2;
            account_status = "Pending";

        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const userData = {

            role_id,

            first_name: req.body.first_name,

            last_name: req.body.last_name,

            email: req.body.email,

            phone: req.body.phone,

            password: hashedPassword,

            account_status

        };

        const result = await userModel.createUser(userData);

        return res.status(201).json({

            success: true,

            message:
                role_id === 2
                    ? "Vendor registration successful. Await administrator approval."
                    : "Customer registration successful.",

            user_id: result.insertId

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

            error: error.message

        });

    }

}

// ======================================
// Login
// ======================================

async function login(req, res) {

    try {

        const {

            email,
            password

        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required."

            });

        }

        const user = await userModel.findUserByEmail(email);

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }

        if (user.account_status !== "Approved") {

            return res.status(403).json({

                success: false,

                message: "Your account has not yet been approved."

            });

        }

        const match = await bcrypt.compare(

            password,

            user.password

        );

        if (!match) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }

        const token = generateToken(user);

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            token,

            user: {

                user_id: user.user_id,

                role_id: user.role_id,

                first_name: user.first_name,

                last_name: user.last_name,

                email: user.email,

                phone: user.phone,

                account_status: user.account_status,

                email_verified: user.email_verified

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

            error: error.message

        });

    }

}

// ======================================
// Get Current User
// ======================================

async function me(req, res) {

    try {

        const user = await userModel.findUserById(req.user.user_id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.json({

            success: true,

            data: user

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

module.exports = {

    register,

    login,

    me

};