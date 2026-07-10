// ======================================
// Role Authorization Middleware
// ======================================

function authorize(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({

                success: false,
                message: "Unauthorized."

            });

        }

        if (!allowedRoles.includes(req.user.role_id)) {

            return res.status(403).json({

                success: false,
                message: "You do not have permission to perform this action."

            });

        }

        next();

    };

}

module.exports = authorize;