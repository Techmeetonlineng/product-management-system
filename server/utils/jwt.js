const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token for a user
 * @param {Object} user
 * @returns {String} JWT Token
 */
function generateToken(user) {
    return jwt.sign(
        {
            user_id: user.user_id,
            role_id: user.role_id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
}

module.exports = {
    generateToken
};