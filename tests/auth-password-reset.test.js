const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateForgotPassword,
  validateResetPassword,
} = require("../server/validations/authValidation");

test("validateForgotPassword rejects empty email", () => {
  const errors = validateForgotPassword({ email: "   " });
  assert.ok(errors.includes("Email is required."));
});

test("validateResetPassword rejects weak password", () => {
  const errors = validateResetPassword({ token: "abc", password: "123" });
  assert.ok(errors.includes("Password must be at least 6 characters."));
});
