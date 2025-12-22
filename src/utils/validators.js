const Joi = require('joi');

// User registration validation
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  phoneNumber: Joi.string()
    .pattern(/^(?:\+254|0)[17]\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Kenyan number'
    }),
  role: Joi.string().valid('shopper', 'shop', 'ppg', 'ppg_supervisor', 'beo', 'beo_supervisor', 'area_manager', 'brand_manager', 'executive', 'admin').required()
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Password reset request validation
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

// Password reset validation
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
    .required()
});

// Receipt upload validation
const receiptUploadSchema = Joi.object({
  storeId: Joi.number().integer().positive().required(),
  totalAmount: Joi.number().positive().required(),
  receiptNumber: Joi.string().max(100).optional(),
  captureMethod: Joi.string().valid('phone', 'email').required()
});

// Brand creation validation
const brandSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  category: Joi.string().required(),
  pointsPerKes: Joi.number().integer().min(8).max(15).required(),
  minPurchaseAmount: Joi.number().min(50).max(200).required(),
  maxPointsPerTransaction: Joi.number().integer().min(5000).max(10000).required(),
  brandManagerId: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
  rolloverEnabled: Joi.boolean().optional(),
  seedingEnabled: Joi.boolean().optional()
});

// Store creation validation
const storeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  chain: Joi.string().required(),
  location: Joi.string().max(200).required(),
  neighborhood: Joi.string().max(100).optional()
});

// Reward creation validation
const rewardSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  type: Joi.string().valid('airtime', 'voucher', 'data').required(),
  pointsCost: Joi.number().integer().positive().required(),
  inventoryCount: Joi.number().integer().min(0).required(),
  isActive: Joi.boolean().optional()
});

// Ticket creation validation
const ticketSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  assignedTo: Joi.number().integer().positive().optional()
});

// Notification creation validation
const notificationSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  type: Joi.string().max(50).required(),
  priority: Joi.string().valid('high', 'medium', 'low').optional(),
  subject: Joi.string().max(200).required(),
  message: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  receiptUploadSchema,
  brandSchema,
  storeSchema,
  rewardSchema,
  ticketSchema,
  notificationSchema
};
