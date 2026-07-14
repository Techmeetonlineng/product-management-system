const nodemailer = require("nodemailer");

// ======================================
// Email Transporter Setup
// ======================================

let transporter;

function initializeTransporter() {
  // Use Gmail or custom SMTP
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_SECURE === "true" || false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
}

// Initialize on module load
if (process.env.MAIL_USER && process.env.MAIL_PASSWORD) {
  initializeTransporter();
}

// ======================================
// Send Password Reset Email
// ======================================

async function sendPasswordResetEmail(user, resetToken) {
  try {
    if (!transporter) {
      console.warn(
        "Mail service not configured. Skipping email send. Token:",
        resetToken,
      );
      return {
        success: false,
        message: "Email service not configured.",
      };
    }

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5000"
    }/reset-password.html?token=${resetToken}`;

    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi ${user.first_name},</p>
          <p>We received a request to reset your password for your Product Management System account.</p>
          <p>Click the button below to reset your password. This link will expire in 15 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            If you did not request a password reset, please ignore this email or contact support.
          </p>
          <p style="color: #999; font-size: 12px;">
            © 2026 Product Management System. All rights reserved.
          </p>
        </div>
      `,
      text: `Password Reset Request\n\nHi ${user.first_name},\n\nWe received a request to reset your password. Click the link below to proceed:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Password reset email sent:", info.messageId);

    return {
      success: true,
      message: "Password reset email has been sent.",
    };
  } catch (error) {
    console.error("Email sending error:", error.message);

    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}

// ======================================
// Send Welcome Email
// ======================================

async function sendWelcomeEmail(user) {
  try {
    if (!transporter) {
      console.warn("Mail service not configured. Skipping welcome email.");
      return;
    }

    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: user.email,
      subject: "Welcome to Product Management System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Product Management System!</h2>
          <p>Hi ${user.first_name},</p>
          <p>Your account has been successfully created.</p>
          <p>You can now login with your credentials.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/login.html" style="background-color: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Login Now
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            © 2026 Product Management System. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Welcome email sent to:", user.email);
  } catch (error) {
    console.error("Welcome email error:", error.message);
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
