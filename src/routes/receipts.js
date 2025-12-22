const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const { roles } = require('../config/constants');
const receiptController = require('../controllers/receiptController');

router.use(auth);

// POST /api/receipts/upload (multipart/form-data with image)
router.post('/upload', 
  roleCheck([roles.SHOPPER, roles.SHOP]), 
  upload.single('receiptImage'),
  receiptController.uploadReceipt
);

// GET /api/receipts - List receipts (filtered by role)
router.get('/', receiptController.listReceipts);

// GET /api/receipts/pending - Get pending receipts (BEO, Admin)
router.get('/pending', 
  roleCheck([roles.BEO, roles.BEO_SUPERVISOR, roles.ADMIN]), 
  receiptController.getPendingReceipts
);

// GET /api/receipts/flagged - Get flagged receipts (BEO Supervisor, Admin)
router.get('/flagged', 
  roleCheck([roles.BEO_SUPERVISOR, roles.ADMIN]), 
  receiptController.getFlaggedReceipts
);

// GET /api/receipts/:id - Get receipt details
router.get('/:id', receiptController.getReceiptDetails);

// PUT /api/receipts/:id/approve - Approve receipt (BEO, Admin)
router.put('/:id/approve', 
  roleCheck([roles.BEO, roles.BEO_SUPERVISOR, roles.ADMIN]), 
  receiptController.approveReceipt
);

// PUT /api/receipts/:id/reject - Reject receipt (BEO, Admin)
router.put('/:id/reject', 
  roleCheck([roles.BEO, roles.BEO_SUPERVISOR, roles.ADMIN]), 
  receiptController.rejectReceipt
);

// PUT /api/receipts/:id/flag - Flag receipt (BEO Supervisor, Admin)
router.put('/:id/flag', 
  roleCheck([roles.BEO_SUPERVISOR, roles.ADMIN]), 
  receiptController.flagReceipt
);

module.exports = router;
