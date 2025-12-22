const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { roles } = require('../config/constants');
const notificationController = require('../controllers/notificationController');

router.use(auth);

// GET /api/notifications - List user's notifications
router.get('/', notificationController.listNotifications);

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// POST /api/notifications - Create notification (Admin only)
router.post('/', 
  roleCheck([roles.ADMIN]), 
  notificationController.createNotification
);

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/mark-all-read - Mark all as read
router.put('/mark-all-read', notificationController.markAllAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
