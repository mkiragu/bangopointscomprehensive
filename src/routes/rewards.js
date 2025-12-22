const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const RewardController = require('../controllers/rewardController');

// All routes require authentication
router.use(auth);

// Public routes (all authenticated users)
router.get('/', RewardController.listRewards);
router.get('/:id', RewardController.getReward);
router.get('/:id/inventory', RewardController.checkInventory);

// Admin only routes
router.post('/', roleCheck(['admin']), RewardController.createReward);
router.put('/:id', roleCheck(['admin']), RewardController.updateReward);
router.delete('/:id', roleCheck(['admin']), RewardController.deleteReward);

module.exports = router;
