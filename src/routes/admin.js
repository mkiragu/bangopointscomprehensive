const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const AdminController = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(auth);
router.use(roleCheck(['admin']));

// Dashboard and statistics
router.get('/dashboard', AdminController.getDashboard);
router.get('/system-health', AdminController.getSystemHealth);
router.get('/audit-logs', AdminController.getAuditLogs);

// User management
router.get('/users', AdminController.listUsers);
router.get('/users/:id', AdminController.getUser);
router.put('/users/:id', AdminController.updateUser);
router.put('/users/:id/activate', AdminController.activateUser);
router.put('/users/:id/deactivate', AdminController.deactivateUser);

module.exports = router;
