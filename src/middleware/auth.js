const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const Helpers = require('../utils/helpers');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const BEARER_PREFIX = 'Bearer ';
    
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
      return res.status(401).json(
        Helpers.errorResponse('No token provided. Authorization denied.')
      );
    }

    const token = authHeader.substring(BEARER_PREFIX.length);

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Get user from database
    const [users] = await db.query(
      'SELECT id, email, role, first_name, last_name, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json(
        Helpers.errorResponse('User not found. Authorization denied.')
      );
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json(
        Helpers.errorResponse('Account is inactive. Please contact support.')
      );
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        Helpers.errorResponse('Token expired. Please login again.')
      );
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        Helpers.errorResponse('Invalid token. Authorization denied.')
      );
    }
    next(error);
  }
};

module.exports = auth;
