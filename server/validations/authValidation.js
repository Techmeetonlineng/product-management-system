// ======================================
// Registration Validation
// ======================================

function validateRegister(data) {
  const errors = [];

  // Role
  if (!data.role) {
    errors.push("Role is required.");
  } else if (!["Vendor", "Customer"].includes(data.role)) {
    errors.push("Role must be Vendor or Customer.");
  }

  // First Name
  if (!data.first_name || data.first_name.trim() === "") {
    errors.push("First name is required.");
  }

  // Last Name
  if (!data.last_name || data.last_name.trim() === "") {
    errors.push("Last name is required.");
  }

  // Email
  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required.");
  } else {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(data.email)) {
      errors.push("Invalid email address.");
    }
  }

  // Phone
  if (!data.phone || data.phone.trim() === "") {
    errors.push("Phone number is required.");
  }

  // Password
  if (!data.password) {
    errors.push("Password is required.");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  return errors;
}

// ======================================
// Login Validation
// ======================================

function validateLogin(data) {
  const errors = [];

  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required.");
  }

  if (!data.password || data.password.trim() === "") {
    errors.push("Password is required.");
  }

  return errors;
}

// ======================================
// Forgot Password Validation
// ======================================

function validateForgotPassword(data) {
  const errors = [];

  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required.");
  } else {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(data.email)) {
      errors.push("Invalid email address.");
    }
  }

  return errors;
}

// ======================================
// Reset Password Validation
// ======================================

function validateResetPassword(data) {
  const errors = [];

  if (!data.token || data.token.trim() === "") {
    errors.push("Reset token is required.");
  }

  if (!data.password) {
    errors.push("Password is required.");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  return errors;
}

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
