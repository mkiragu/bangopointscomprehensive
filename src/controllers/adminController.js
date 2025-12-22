const User = require('../models/User');
const Shopper = require('../models/Shopper');
const Brand = require('../models/Brand');
const Store = require('../models/Store');
const Receipt = require('../models/Receipt');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const db = require('../config/database');

class AdminController {
  /**
   * Get platform dashboard statistics
   * GET /api/admin/dashboard
   */
  static async getDashboard(req, res, next) {
    try {
      // User statistics
      const [userStats] = await db.query(`
        SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'shopper' THEN 1 ELSE 0 END) as shoppers,
          SUM(CASE WHEN role = 'shop' THEN 1 ELSE 0 END) as shops,
          SUM(CASE WHEN role = 'ppg' THEN 1 ELSE 0 END) as ppg_staff,
          SUM(CASE WHEN role = 'beo' THEN 1 ELSE 0 END) as beo_staff,
          SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_users
        FROM users
      `);

      // Points statistics
      const [pointsStats] = await db.query(`
        SELECT 
          COALESCE(SUM(points_balance), 0) as total_points_available,
          COALESCE(SUM(total_points_earned), 0) as total_points_earned,
          COALESCE(AVG(points_balance), 0) as avg_points_per_shopper
        FROM shoppers
      `);

      // Receipt statistics
      const [receiptStats] = await db.query(`
        SELECT 
          COUNT(*) as total_receipts,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(CASE WHEN status = 'flagged' THEN 1 ELSE 0 END) as flagged,
          COALESCE(SUM(points_awarded), 0) as total_points_awarded,
          COALESCE(SUM(total_amount), 0) as total_transaction_value
        FROM receipts
      `);

      // Tier distribution
      const [tierStats] = await db.query(`
        SELECT 
          loyalty_tier,
          COUNT(*) as count
        FROM shoppers
        GROUP BY loyalty_tier
      `);

      logger.info('Admin dashboard viewed', { userId: req.user.id });

      res.json({
        success: true,
        data: {
          users: userStats[0],
          points: {
            totalAvailable: parseInt(pointsStats[0].total_points_available),
            totalEarned: parseInt(pointsStats[0].total_points_earned),
            averagePerShopper: parseFloat(pointsStats[0].avg_points_per_shopper).toFixed(2)
          },
          receipts: {
            total: receiptStats[0].total_receipts,
            pending: receiptStats[0].pending,
            approved: receiptStats[0].approved,
            rejected: receiptStats[0].rejected,
            flagged: receiptStats[0].flagged,
            totalPointsAwarded: parseInt(receiptStats[0].total_points_awarded),
            totalTransactionValue: parseFloat(receiptStats[0].total_transaction_value)
          },
          tierDistribution: tierStats
        }
      });
    } catch (error) {
      logger.error('Error getting admin dashboard:', error);
      next(error);
    }
  }

  /**
   * List all users with filtering
   * GET /api/admin/users
   */
  static async listUsers(req, res, next) {
    try {
      const { role, isActive, search, page = 1, perPage = 30 } = req.query;

      let query = 'SELECT id, email, role, first_name, last_name, phone_number, is_active, email_verified, created_at FROM users WHERE 1=1';
      const params = [];

      if (role) {
        query += ' AND role = ?';
        params.push(role);
      }

      if (isActive !== undefined) {
        query += ' AND is_active = ?';
        params.push(isActive === 'true');
      }

      if (search) {
        query += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      const limit = Math.min(parseInt(perPage), 100);
      const offset = (Math.max(parseInt(page), 1) - 1) * limit;
      params.push(limit, offset);

      const [users] = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
      const countParams = [];

      if (role) {
        countQuery += ' AND role = ?';
        countParams.push(role);
      }

      if (isActive !== undefined) {
        countQuery += ' AND is_active = ?';
        countParams.push(isActive === 'true');
      }

      if (search) {
        countQuery += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      const [countResult] = await db.query(countQuery, countParams);

      logger.info(`Admin listed users: ${users.length} results`, { 
        userId: req.user.id 
      });

      res.json({
        success: true,
        data: users,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          perPage: limit,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      });
    } catch (error) {
      logger.error('Error listing users:', error);
      next(error);
    }
  }

  /**
   * Get user details
   * GET /api/admin/users/:id
   */
  static async getUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Remove password hash from response
      delete user.password_hash;

      // If shopper, get shopper details
      let shopperDetails = null;
      if (user.role === 'shopper') {
        shopperDetails = await Shopper.findByUserId(id);
      }

      logger.info('Admin viewed user details', { 
        userId: req.user.id, 
        targetUserId: id 
      });

      res.json({
        success: true,
        data: {
          ...user,
          shopperDetails
        }
      });
    } catch (error) {
      logger.error('Error getting user:', error);
      next(error);
    }
  }

  /**
   * Update user (Admin only)
   * PUT /api/admin/users/:id
   */
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await User.update(id, updates);

      const updatedUser = await User.findById(id);
      delete updatedUser.password_hash;

      logger.info('Admin updated user', { 
        userId: req.user.id, 
        targetUserId: id 
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      logger.error('Error updating user:', error);
      next(error);
    }
  }

  /**
   * Deactivate user
   * PUT /api/admin/users/:id/deactivate
   */
  static async deactivateUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await User.update(id, { is_active: false });

      logger.info('Admin deactivated user', { 
        userId: req.user.id, 
        targetUserId: id 
      });

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      logger.error('Error deactivating user:', error);
      next(error);
    }
  }

  /**
   * Activate user
   * PUT /api/admin/users/:id/activate
   */
  static async activateUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await User.update(id, { is_active: true });

      logger.info('Admin activated user', { 
        userId: req.user.id, 
        targetUserId: id 
      });

      res.json({
        success: true,
        message: 'User activated successfully'
      });
    } catch (error) {
      logger.error('Error activating user:', error);
      next(error);
    }
  }

  /**
   * Get system health
   * GET /api/admin/system-health
   */
  static async getSystemHealth(req, res, next) {
    try {
      // Database connection check
      let dbStatus = 'healthy';
      try {
        await db.query('SELECT 1');
      } catch (error) {
        dbStatus = 'unhealthy';
      }

      // Get recent activity
      const [recentReceipts] = await db.query(`
        SELECT COUNT(*) as count 
        FROM receipts 
        WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
      `);

      const [recentUsers] = await db.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
      `);

      logger.info('Admin checked system health', { userId: req.user.id });

      res.json({
        success: true,
        data: {
          status: dbStatus === 'healthy' ? 'operational' : 'degraded',
          database: dbStatus,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          recentActivity: {
            receiptsLastHour: recentReceipts[0].count,
            newUsersLast24Hours: recentUsers[0].count
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error getting system health:', error);
      next(error);
    }
  }

  /**
   * Get audit logs
   * GET /api/admin/audit-logs
   * 
   * NOTE: This currently returns notifications as a temporary implementation.
   * In production, this should be replaced with a proper audit_logs table
   * that tracks all critical operations (user actions, data changes, etc.)
   */
  static async getAuditLogs(req, res, next) {
    try {
      const { page = 1, perPage = 50, userId, action } = req.query;

      // TODO: Implement proper audit logging table
      // This is a temporary workaround using notifications
      const filters = {};
      if (userId) filters.userId = userId;

      const result = await Notification.findAll(filters, page, perPage);

      logger.info('Admin viewed audit logs', { userId: req.user.id });

      res.json({
        success: true,
        message: 'Note: Currently showing notifications as proxy for audit logs. Proper audit logging to be implemented.',
        data: result.notifications,
        pagination: {
          total: result.total,
          page: result.page,
          perPage: result.perPage,
          totalPages: Math.ceil(result.total / result.perPage)
        }
      });
    } catch (error) {
      logger.error('Error getting audit logs:', error);
      next(error);
    }
  }
}

module.exports = AdminController;
