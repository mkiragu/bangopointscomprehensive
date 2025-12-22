const logger = require('../utils/logger');
const Helpers = require('../utils/helpers');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json(
      Helpers.errorResponse('Validation error', err.details.map(d => d.message))
    );
  }

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json(
      Helpers.errorResponse('Duplicate entry. Record already exists.')
    );
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json(
      Helpers.errorResponse('Invalid reference. Related record does not exist.')
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      Helpers.errorResponse('Invalid token')
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      Helpers.errorResponse('Token expired')
    );
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(
        Helpers.errorResponse('File size too large. Maximum size is 10MB.')
      );
    }
    return res.status(400).json(
      Helpers.errorResponse(`File upload error: ${err.message}`)
    );
  }

  // Custom application errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json(
    Helpers.errorResponse(message)
  );
};

module.exports = errorHandler;
