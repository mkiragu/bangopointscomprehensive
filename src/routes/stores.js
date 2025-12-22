const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const StoreController = require('../controllers/storeController');

// All routes require authentication
router.use(auth);

// Public routes (all authenticated users)
router.get('/', StoreController.listStores);
router.get('/:id', StoreController.getStore);
router.get('/:id/performance', StoreController.getStorePerformance);

// Admin only routes
router.post('/', roleCheck(['admin']), StoreController.createStore);
router.put('/:id', roleCheck(['admin']), StoreController.updateStore);
router.delete('/:id', roleCheck(['admin']), StoreController.deleteStore);

module.exports = router;
