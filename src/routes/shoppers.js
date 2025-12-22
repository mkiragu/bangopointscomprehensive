const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { roles } = require('../config/constants');
const shopperController = require('../controllers/shopperController');

// All shopper routes require authentication and shopper role
router.use(auth);
router.use(roleCheck([roles.SHOPPER]));

// GET /api/shoppers/profile
router.get('/profile', shopperController.getProfile);

// PUT /api/shoppers/profile
router.put('/profile', shopperController.updateProfile);

// GET /api/shoppers/points
router.get('/points', shopperController.getPoints);

// GET /api/shoppers/receipts
router.get('/receipts', shopperController.getReceipts);

// GET /api/shoppers/eligible-brands
router.get('/eligible-brands', shopperController.getEligibleBrands);

// GET /api/shoppers/tier-info
router.get('/tier-info', shopperController.getTierInfo);

// GET /api/shoppers/rewards
router.get('/rewards', shopperController.getAvailableRewards);

// POST /api/shoppers/redeem-reward
router.post('/redeem-reward', shopperController.redeemReward);

module.exports = router;
