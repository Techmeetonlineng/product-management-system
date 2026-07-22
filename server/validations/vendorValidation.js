// ======================================
// Vendor Validation
// ======================================

function validateVendor(data) {
  const errors = [];

  // First name validation
  if (!data.first_name || data.first_name.trim() === "") {
    errors.push("First name is required");
  } else if (data.first_name.length < 2) {
    errors.push("First name must be at least 2 characters");
  }

  // Last name validation
  if (!data.last_name || data.last_name.trim() === "") {
    errors.push("Last name is required");
  } else if (data.last_name.length < 2) {
    errors.push("Last name must be at least 2 characters");
  }

  // Email validation
  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required");
  } else if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  // Phone validation
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push("Invalid phone number");
  }

  // Account status validation
  if (data.account_status) {
    const validStatuses = ["Pending", "Approved", "Rejected", "Suspended"];
    if (!validStatuses.includes(data.account_status)) {
      errors.push("Invalid account status");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// ======================================
// Helper Functions
// ======================================

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  const re = /^[\d+\-\s()]{10,}$/;
  return re.test(phone);
}
