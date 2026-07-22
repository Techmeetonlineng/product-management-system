// ======================================
// OnCampus Marketplace
// Authentication
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", login);

  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", register);

  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm)
    forgotPasswordForm.addEventListener("submit", forgotPassword);

  const resetPasswordForm = document.getElementById("resetPasswordForm");
  if (resetPasswordForm)
    resetPasswordForm.addEventListener("submit", resetPassword);

  initPasswordStrengthChecklist();
  initConfirmPasswordToggle();
});

// ======================================
// PASSWORD STRENGTH (shared by register + reset password)
// ======================================
// Mirrors server/validations/authValidation.js's getPasswordStrengthErrors()
// so the person gets instant feedback instead of a round trip to the
// server just to find out their password is too weak.

const PASSWORD_RULES = {
  length: (value) => value.length >= 8,
  lower: (value) => /[a-z]/.test(value),
  upper: (value) => /[A-Z]/.test(value),
  number: (value) => /[0-9]/.test(value),
  special: (value) => /[^A-Za-z0-9]/.test(value),
};

function getUnmetPasswordRules(password) {
  return Object.entries(PASSWORD_RULES)
    .filter(([, check]) => !check(password || ""))
    .map(([rule]) => rule);
}

function isPasswordStrong(password) {
  return getUnmetPasswordRules(password).length === 0;
}

function initPasswordStrengthChecklist() {
  const passwordInput = document.getElementById("password");
  const list = document.getElementById("passwordRequirements");
  if (!passwordInput || !list) return;

  passwordInput.addEventListener("input", () => {
    const unmet = new Set(getUnmetPasswordRules(passwordInput.value));

    list.querySelectorAll("li[data-rule]").forEach((item) => {
      const rule = item.getAttribute("data-rule");
      item.classList.toggle("met", !unmet.has(rule));
    });
  });
}

function initConfirmPasswordToggle() {
  const toggle = document.getElementById("toggleConfirmPassword");
  const confirmPassword = document.getElementById("password_confirmation");
  if (!toggle || !confirmPassword) return;

  toggle.addEventListener("click", () => {
    const isPassword = confirmPassword.type === "password";
    confirmPassword.type = isPassword ? "text" : "password";
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
    }
  });
}

// ======================================
// LOGIN
// ======================================

async function login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const result = await API.post(CONFIG.API.ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    if (!result.success) {
      showError("Login Failed", result.message);
      return;
    }

    // Store auth data
    API.setAuth(result.token, result.user);

    // Redirect based on role
    switch (result.user.role_id) {
      case CONFIG.ROLES.ADMIN:
        window.location.href = "/pages/admin/dashboard.html";
        break;
      case CONFIG.ROLES.VENDOR:
        window.location.href = "/pages/vendor/dashboard.html";
        break;
      case CONFIG.ROLES.CUSTOMER:
        window.location.href = "/pages/customer/dashboard.html";
        break;
      default:
        window.location.href = "/";
    }
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to login.");
  }
}

// ======================================
// REGISTER
// ======================================

async function register(e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const passwordConfirmation = document.getElementById(
    "password_confirmation",
  ).value;

  if (password !== passwordConfirmation) {
    showError("Registration Failed", "Passwords do not match.");
    return;
  }

  if (!isPasswordStrong(password)) {
    showError(
      "Registration Failed",
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
    );
    return;
  }

  const data = {
    first_name: document.getElementById("first_name").value.trim(),
    last_name: document.getElementById("last_name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    role: document.getElementById("role").value,
    password,
  };

  try {
    const result = await API.post(CONFIG.API.ENDPOINTS.AUTH.REGISTER, data);

    if (!result.success) {
      showError("Registration Failed", result.message);
      return;
    }

    // For customers - auto-login
    if (result.user && result.user.role_id === CONFIG.ROLES.CUSTOMER) {
      API.setAuth(result.token, result.user);
      showSuccess("Welcome!", "Registration successful.").then(() => {
        window.location.href = "/pages/customer/dashboard.html";
      });
      return;
    }

    // For vendors - require approval
    showSuccess(
      "Registration Successful",
      "Your vendor account has been created successfully. Please wait for Administrator approval before you can login.",
    ).then(() => {
      window.location.href = "/login.html";
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to register.");
  }
}

// ======================================
// FORGOT PASSWORD
// ======================================

async function forgotPassword(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  try {
    const result = await API.post(CONFIG.API.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });

    if (!result.success) {
      showError("Password Reset Failed", result.message);
      return;
    }

    showSuccess(
      "Email Sent",
      "If that email exists in our system, you will receive a password reset link shortly.",
    ).then(() => {
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 2000);
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to process password reset.");
  }
}

// ======================================
// RESET PASSWORD
// ======================================

async function resetPassword(e) {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const password = document.getElementById("password").value;
  const passwordConfirmation = document.getElementById(
    "password_confirmation",
  ).value;

  if (password !== passwordConfirmation) {
    showError("Password Reset Failed", "Passwords do not match.");
    return;
  }

  if (!isPasswordStrong(password)) {
    showError(
      "Password Reset Failed",
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
    );
    return;
  }

  try {
    const result = await API.post(CONFIG.API.ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
      password_confirmation: passwordConfirmation,
    });

    if (!result.success) {
      showError("Password Reset Failed", result.message);
      return;
    }

    showSuccess("Password Updated", result.message).then(() => {
      window.location.href = "/login.html";
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to reset password.");
  }
}
