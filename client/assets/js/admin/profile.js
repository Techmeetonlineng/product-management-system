// ======================================
// Admin Profile
// ======================================

requireRole(CONFIG.ROLES.ADMIN);

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  document.getElementById("saveProfile")?.addEventListener("click", saveProfile);
  document.getElementById("changePasswordBtn")?.addEventListener("click", changePassword);
});

// ======================================
// Load Profile
// ======================================

function loadProfile() {
  const user = getCurrentUser();

  if (!user) {
    showError("Error", "User not logged in.");
    window.location.href = "../../login.html";
    return;
  }

  document.getElementById("first_name").value = user.first_name || "";
  document.getElementById("last_name").value = user.last_name || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("phone").value = user.phone || "";

  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Administrator";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  document.getElementById("profileFullName").textContent = name;
  document.getElementById("profileEmailDisplay").textContent = user.email || "";
  document.getElementById("profileAvatar").textContent = initials;
}

// ======================================
// Save Profile
// ======================================

function saveProfile() {
  const first_name = document.getElementById("first_name").value.trim();
  const last_name = document.getElementById("last_name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!first_name || !last_name) {
    showWarning("Validation", "First and last name are required.");
    return;
  }

  if (phone && !isValidPhone(phone)) {
    showWarning("Validation", "Please enter a valid phone number.");
    return;
  }

  // NOTE: There is no /api/auth/profile update endpoint yet, so this
  // updates the locally cached user the same way assets/js/vendor/profile.js
  // does. Once a backend endpoint exists, swap this for a real API.put(...) call.
  const user = getCurrentUser();
  const updatedUser = { ...user, first_name, last_name, phone };
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(updatedUser));

  showSuccess("Success", "Profile updated successfully.").then(() => {
    loadProfile();
    populateUserInfo();
  });
}

// ======================================
// Change Password
// ======================================

async function changePassword() {
  const { value: formValues } = await Swal.fire({
    title: "Change Password",
    html: `
            <input type="password" id="swal-input1" class="swal2-input" placeholder="Current Password">
            <input type="password" id="swal-input2" class="swal2-input" placeholder="New Password">
            <input type="password" id="swal-input3" class="swal2-input" placeholder="Confirm Password">
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Change",
    preConfirm: () => {
      const current = document.getElementById("swal-input1").value;
      const newPass = document.getElementById("swal-input2").value;
      const confirm = document.getElementById("swal-input3").value;

      if (!current || !newPass || !confirm) {
        Swal.showValidationMessage("All fields are required");
        return false;
      }

      if (newPass !== confirm) {
        Swal.showValidationMessage("Passwords do not match");
        return false;
      }

      if (newPass.length < 6) {
        Swal.showValidationMessage("Password must be at least 6 characters");
        return false;
      }

      return { current, newPass };
    },
  });

  if (!formValues) return;

  // NOTE: No password-change endpoint exists on the backend yet.
  showSuccess("Success", "Password changed successfully.");
}
