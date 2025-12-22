const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { roles } = require('../config/constants');

// All shopper routes require authentication and shopper role
router.use(auth);
router.use(roleCheck([roles.SHOPPER]));

// GET /api/shoppers/profile
router.get('/profile', (req, res) => {
  res.json({ success: true, message: 'Shopper profile endpoint' });
});

// PUT /api/shoppers/profile
router.put('/profile', (req, res) => {
  res.json({ success: true, message: 'Update shopper profile endpoint' });
});

// GET /api/shoppers/points
router.get('/points', (req, res) => {
  res.json({ success: true, message: 'Shopper points endpoint' });
});

// GET /api/shoppers/receipts
router.get('/receipts', (req, res) => {
  res.json({ success: true, message: 'Shopper receipts endpoint' });
});

// GET /api/shoppers/eligible-brands
router.get('/eligible-brands', (req, res) => {
  res.json({ success: true, message: 'Eligible brands endpoint' });
});

// GET /api/shoppers/tier-info
router.get('/tier-info', (req, res) => {
  res.json({ success: true, message: 'Tier info endpoint' });
});

// GET /api/shoppers/rewards
router.get('/rewards', (req, res) => {
  res.json({ success: true, message: 'Rewards endpoint' });
});

// POST /api/shoppers/redeem-reward
router.post('/redeem-reward', (req, res) => {
  res.json({ success: true, message: 'Redeem reward endpoint' });
});

module.exports = router;
