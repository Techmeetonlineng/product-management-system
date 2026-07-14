const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../validations/authValidation");
const { sendPasswordResetEmail } = require("../utils/mailService");

// ======================================
// REGISTER
// ======================================

async function register(req, res) {
  try {
    const errors = validateRegister(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    const { first_name, last_name, email, phone, password, role } = req.body;

    // Check existing email
    const existingUser = await authModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role_id = role === "Vendor" ? 2 : 3;

    const account_status = role_id === 2 ? "Pending" : "Approved";

    const result = await authModel.createUser({
      role_id,
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      account_status,
    });

    // CUSTOMER
    if (role_id === 3) {
      const token = jwt.sign(
        {
          user_id: result.insertId,
          role_id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      );

      return res.status(201).json({
        success: true,

        message: "Registration successful.",

        token,

        user: {
          user_id: result.insertId,

          role_id,

          first_name,

          last_name,

          email,

          account_status,
        },
      });
    }

    // VENDOR
    return res.status(201).json({
      success: true,

      message:
        "Registration successful. Please wait for Administrator approval.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Unable to register.",
    });
  }
}

// ======================================
// LOGIN
// ======================================

async function login(req, res) {
  try {
    const errors = validateLogin(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    const { email, password } = req.body;

    const user = await authModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Trim stored hash to avoid hidden/trailing whitespace causing compare to fail
    const storedHash = (user.password || "").trim();
    const valid = await bcrypt.compare(password, storedHash);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Vendor must be approved
    if (user.role_id === 2 && user.account_status !== "Approved") {
      return res.status(403).json({
        success: false,
        message: "Your vendor account is awaiting Administrator approval.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

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
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
}

// ======================================
// FORGOT PASSWORD
// ======================================

async function forgotPassword(req, res) {
  try {
    const errors = validateForgotPassword(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    const { email } = req.body;
    const user = await authModel.findByEmail(email);

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been generated.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await authModel.savePasswordResetToken(user.user_id, token, expiresAt);

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user, token);

    // Always return success to prevent email enumeration
    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset.",
    });
  }
}

// ======================================
// RESET PASSWORD
// ======================================

async function resetPassword(req, res) {
  try {
    const errors = validateResetPassword(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    const { token, password } = req.body;
    const user = await authModel.findUserByResetToken(token);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await authModel.updatePassword(user.user_id, hashedPassword);
    await authModel.clearPasswordResetToken(user.user_id);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password.",
    });
  }
}

// ======================================
// CURRENT USER
// ======================================

async function me(req, res) {
  try {
    const user = await authModel.findById(req.user.user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user.",
    });
  }
}

module.exports = {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
};
