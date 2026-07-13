// ======================================
// Category Validation
// ======================================

function validateCategory(data) {

    const errors = [];

    // ======================================
    // Category Name
    // ======================================

    if (!data.category_name || data.category_name.trim() === "") {

        errors.push("Category name is required.");

    }
    else if (data.category_name.length < 3) {

        errors.push("Category name must be at least 3 characters.");

    }
    else if (data.category_name.length > 100) {

        errors.push("Category name cannot exceed 100 characters.");

    }

    // ======================================
    // Description
    // ======================================

    if (data.description && data.description.length > 255) {

        errors.push("Description cannot exceed 255 characters.");

    }

    // ======================================
    // Status
    // ======================================

    if (
        data.status &&
        !["Active", "Inactive"].includes(data.status)
    ) {

        errors.push("Invalid category status.");

    }

    return errors;

}

module.exports = {

    validateCategory

};