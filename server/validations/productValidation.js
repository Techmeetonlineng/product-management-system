// ======================================
// Product Validation
// ======================================

function validateProduct(data) {
  const errors = [];

  // Category ID validation
  if (!data.category_id) {
    errors.push("Category is required");
  }

  // Product name validation
  if (!data.product_name || data.product_name.trim() === "") {
    errors.push("Product name is required");
  } else if (data.product_name.length < 3) {
    errors.push("Product name must be at least 3 characters");
  } else if (data.product_name.length > 100) {
    errors.push("Product name cannot exceed 100 characters");
  }

  // SKU validation
  if (!data.sku || data.sku.trim() === "") {
    errors.push("SKU is required");
  }

  // Price validation
  if (data.price === undefined || data.price === null || data.price === "") {
    errors.push("Price is required");
  } else if (isNaN(data.price) || Number(data.price) < 0) {
    errors.push("Price must be a valid non-negative number");
  }

  // Quantity validation
  if (data.quantity === undefined || data.quantity === null || data.quantity === "") {
    errors.push("Quantity is required");
  } else if (isNaN(data.quantity) || Number(data.quantity) < 0) {
    errors.push("Quantity must be a valid non-negative number");
  }

  // Description validation
  if (data.description && data.description.length > 500) {
    errors.push("Description cannot exceed 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// ======================================
// Category Validation
// ======================================

function validateCategory(data) {
  const errors = [];

  if (!data.category_name || data.category_name.trim() === "") {
    errors.push("Category name is required");
  } else if (data.category_name.length < 2) {
    errors.push("Category name must be at least 2 characters");
  } else if (data.category_name.length > 50) {
    errors.push("Category name cannot exceed 50 characters");
  }

  if (data.description && data.description.length > 500) {
    errors.push("Description cannot exceed 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

module.exports = {
  validateProduct,
};
