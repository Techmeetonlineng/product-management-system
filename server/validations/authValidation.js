function validateRegister(data) {

    const errors = [];

    if (!data.role) {
        errors.push("Role is required.");
    }

    if (!["Vendor", "Customer"].includes(data.role)) {
        errors.push("Role must be Vendor or Customer.");
    }

    if (!data.first_name || data.first_name.trim() === "") {
        errors.push("First name is required.");
    }

    if (!data.last_name || data.last_name.trim() === "") {
        errors.push("Last name is required.");
    }

    if (!data.email || data.email.trim() === "") {
        errors.push("Email is required.");
    }

    if (!data.phone || data.phone.trim() === "") {
        errors.push("Phone number is required.");
    }

    if (!data.password || data.password.length < 6) {
        errors.push("Password must be at least 6 characters.");
    }

    return errors;
}

module.exports = {
    validateRegister
};