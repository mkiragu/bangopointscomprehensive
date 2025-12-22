const Helpers = require('../utils/helpers');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 */
const validation = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json(
        Helpers.errorResponse('Validation failed', errors)
      );
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};

module.exports = validation;
