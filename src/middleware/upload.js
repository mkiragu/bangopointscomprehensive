const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Helpers = require('../utils/helpers');
const { uploadLimits } = require('../config/constants');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './public/uploads/receipts';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = Helpers.sanitizeFilename(file.originalname);
    cb(null, `receipt-${uniqueSuffix}-${sanitizedName}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (uploadLimits.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: uploadLimits.MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

module.exports = upload;
