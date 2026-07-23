// ======================================
// Role Authorization Middleware
// ======================================

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
}

module.exports = (...roles) => {
  return (req, res, next) => {
    console.log("========== ROLE CHECK ==========");
    console.log("User:", req.user);
    console.log("User Role:", req.user.role_id);
    console.log("Allowed Roles:", roles);
    console.log("================================");

    if (!roles.includes(req.user.role_id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    next();
  };
};

module.exports = authorize;
