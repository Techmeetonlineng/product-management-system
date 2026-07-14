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
});

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

  const data = {
    first_name: document.getElementById("first_name").value.trim(),
    last_name: document.getElementById("last_name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    role: document.getElementById("role").value,
    password: document.getElementById("password").value,
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

  try {
    const result = await API.post(CONFIG.API.ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
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
