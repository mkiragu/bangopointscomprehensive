const Helpers = require('../utils/helpers');
const { roles } = require('../config/constants');

/**
 * Role-based access control middleware
 * @param {Array} allowedRoles - Array of roles that are allowed to access the route
 */
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        Helpers.errorResponse('Authentication required')
      );
    }

    // Admin has access to everything
    if (req.user.role === roles.ADMIN) {
      return next();
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(
        Helpers.errorResponse('Access denied. Insufficient permissions.')
      );
    }

    next();
  };
};

module.exports = roleCheck;
