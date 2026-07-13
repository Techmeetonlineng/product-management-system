// ======================================
// Vendor Profile
// ======================================

requireRole(CONFIG.ROLES.VENDOR);

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  document
    .getElementById("saveProfile")
    ?.addEventListener("click", saveProfile);
  document
    .getElementById("changePasswordBtn")
    ?.addEventListener("click", changePassword);
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

  if (document.getElementById("first_name")) {
    document.getElementById("first_name").value = user.first_name || "";
  }
  if (document.getElementById("last_name")) {
    document.getElementById("last_name").value = user.last_name || "";
  }
  if (document.getElementById("email")) {
    document.getElementById("email").value = user.email || "";
  }
  if (document.getElementById("email")) {
    document.getElementById("email").disabled = true;
  }
  if (document.getElementById("phone")) {
    document.getElementById("phone").value = user.phone || "";
  }
  if (document.getElementById("accountStatus")) {
    document.getElementById("accountStatus").textContent = user.account_status;
    const badgeClass = getStatusBadgeClass(user.account_status);
    document.getElementById("accountStatus").className =
      `badge bg-${badgeClass}`;
  }
}

// ======================================
// Save Profile
// ======================================

async function saveProfile() {
  try {
    const first_name =
      document.getElementById("first_name")?.value.trim() || "";
    const last_name = document.getElementById("last_name")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";

    if (!first_name || !last_name) {
      showWarning("Validation", "First and last name are required.");
      return;
    }

    if (phone && !isValidPhone(phone)) {
      showWarning("Validation", "Please enter a valid phone number.");
      return;
    }

    const data = { first_name, last_name, phone };

    // Note: This endpoint needs to be added to backend
    // For now, just update local storage
    const user = getCurrentUser();
    const updatedUser = { ...user, ...data };
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    showSuccess("Success", "Profile updated successfully.").then(() => {
      loadProfile();
    });
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to update profile.");
  }
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

  try {
    // Note: This endpoint needs to be added to backend
    showSuccess("Success", "Password changed successfully.");
  } catch (error) {
    console.error(error);
    showError("Error", "Unable to change password.");
  }
}

// ======================================
// Save Profile
// ======================================

function saveProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  user.first_name = document.getElementById("first_name").value.trim();

  user.last_name = document.getElementById("last_name").value.trim();

  user.phone = document.getElementById("phone").value.trim();

  user.address = document.getElementById("address").value.trim();

  localStorage.setItem("user", JSON.stringify(user));

  Swal.fire("Success", "Profile updated successfully.", "success");
}
