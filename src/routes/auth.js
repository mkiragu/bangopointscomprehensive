const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../utils/validators');

// POST /api/auth/register
router.post('/register', validation(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validation(loginSchema), authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// POST /api/auth/forgot-password
router.post('/forgot-password', validation(forgotPasswordSchema), authController.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', validation(resetPasswordSchema), authController.resetPassword);

// POST /api/auth/verify-email
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
