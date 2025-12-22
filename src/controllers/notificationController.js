const Notification = require('../models/Notification');
const Helpers = require('../utils/helpers');
const logger = require('../utils/logger');

class NotificationController {
  // GET /api/notifications
  static async listNotifications(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;
      
      const filters = {};
      if (req.query.isRead !== undefined) {
        filters.isRead = req.query.isRead === 'true';
      }
      if (req.query.priority) {
        filters.priority = req.query.priority;
      }
      if (req.query.type) {
        filters.type = req.query.type;
      }

      const result = await Notification.findByUserId(req.user.id, filters, page, perPage);

      res.json(
        Helpers.successResponse(result)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/notifications/unread-count
  static async getUnreadCount(req, res, next) {
    try {
      const count = await Notification.getUnreadCount(req.user.id);

      res.json(
        Helpers.successResponse({ count })
      );
    } catch (error) {
      next(error);
    }
  }

  // POST /api/notifications
  static async createNotification(req, res, next) {
    try {
      const { userId, type, priority, subject, message } = req.body;

      if (!userId || !type || !subject || !message) {
        return res.status(400).json(
          Helpers.errorResponse('userId, type, subject, and message are required')
        );
      }

      const notificationId = await Notification.create({
        userId,
        senderId: req.user.id,
        type,
        priority: priority || 'medium',
        subject,
        message
      });

      logger.info(`Notification created: ${notificationId} by ${req.user.email}`);

      res.status(201).json(
        Helpers.successResponse({ notificationId }, 'Notification created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/notifications/:id/read
  static async markAsRead(req, res, next) {
    try {
      const notificationId = req.params.id;

      await Notification.markAsRead(notificationId);

      res.json(
        Helpers.successResponse(null, 'Notification marked as read')
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/notifications/mark-all-read
  static async markAllAsRead(req, res, next) {
    try {
      await Notification.markAllAsRead(req.user.id);

      res.json(
        Helpers.successResponse(null, 'All notifications marked as read')
      );
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/notifications/:id
  static async deleteNotification(req, res, next) {
    try {
      const notificationId = req.params.id;

      await Notification.delete(notificationId);

      res.json(
        Helpers.successResponse(null, 'Notification deleted')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
