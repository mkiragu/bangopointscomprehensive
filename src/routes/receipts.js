const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Receipts list endpoint' });
});

router.post('/upload', (req, res) => {
  res.json({ success: true, message: 'Receipt upload endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, message: 'Receipt details endpoint' });
});

module.exports = router;
