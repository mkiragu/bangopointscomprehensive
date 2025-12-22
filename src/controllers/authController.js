const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shopper = require('../models/Shopper');
const { jwtSecret, jwtExpire, jwtRefreshExpire } = require('../config/auth');
const Helpers = require('../utils/helpers');
const logger = require('../utils/logger');

class AuthController {
  // Register new user
  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, phoneNumber, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json(
          Helpers.errorResponse('User with this email already exists')
        );
      }

      // Create user
      const userId = await User.create({
        email,
        password,
        role,
        firstName,
        lastName,
        phoneNumber
      });

      // If role is shopper, create shopper record
      if (role === 'shopper') {
        await Shopper.create(userId);
      }

      logger.info(`New user registered: ${email} with role: ${role}`);

      // Generate verification token (in production, send via email)
      const verificationToken = Helpers.generateToken();

      res.status(201).json(
        Helpers.successResponse(
          { userId, verificationToken },
          'Registration successful. Please verify your email.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json(
          Helpers.errorResponse('Invalid email or password')
        );
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json(
          Helpers.errorResponse('Account is inactive. Please contact support.')
        );
      }

      // Verify password
      const isPasswordValid = await User.comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json(
          Helpers.errorResponse('Invalid email or password')
        );
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpire }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        jwtSecret,
        { expiresIn: jwtRefreshExpire }
      );

      logger.info(`User logged in: ${email}`);

      res.json(
        Helpers.successResponse({
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            emailVerified: user.email_verified
          },
          accessToken,
          refreshToken
        }, 'Login successful')
      );
    } catch (error) {
      next(error);
    }
  }

  // Logout user
  static async logout(req, res, next) {
    try {
      // In a production app, you might want to blacklist the token
      res.json(
        Helpers.successResponse(null, 'Logout successful')
      );
    } catch (error) {
      next(error);
    }
  }

  // Refresh access token
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json(
          Helpers.errorResponse('Refresh token is required')
        );
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, jwtSecret);

      if (decoded.type !== 'refresh') {
        return res.status(401).json(
          Helpers.errorResponse('Invalid refresh token')
        );
      }

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user || !user.is_active) {
        return res.status(401).json(
          Helpers.errorResponse('User not found or inactive')
        );
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpire }
      );

      res.json(
        Helpers.successResponse({ accessToken }, 'Token refreshed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // Forgot password
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return res.json(
          Helpers.successResponse(null, 'If the email exists, a reset link has been sent.')
        );
      }

      // Generate reset token
      const resetToken = Helpers.generateToken();

      // In production, save token to database and send email
      logger.info(`Password reset requested for: ${email}`);

      res.json(
        Helpers.successResponse(
          { resetToken }, // In production, don't return token in response
          'If the email exists, a reset link has been sent.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // Reset password
  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;

      // In production, verify token from database
      // For now, we'll skip token verification

      // Update password
      // This is simplified - in production, get userId from token
      const userId = req.body.userId; // Should come from verified token

      if (!userId) {
        return res.status(400).json(
          Helpers.errorResponse('Invalid or expired reset token')
        );
      }

      await User.updatePassword(userId, password);

      logger.info(`Password reset successful for user ID: ${userId}`);

      res.json(
        Helpers.successResponse(null, 'Password reset successful')
      );
    } catch (error) {
      next(error);
    }
  }

  // Verify email
  static async verifyEmail(req, res, next) {
    try {
      const { token, userId } = req.body;

      if (!token || !userId) {
        return res.status(400).json(
          Helpers.errorResponse('Token and userId are required')
        );
      }

      // In production, verify token from database
      await User.verifyEmail(userId);

      logger.info(`Email verified for user ID: ${userId}`);

      res.json(
        Helpers.successResponse(null, 'Email verified successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
