const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validation = require('../middleware/validation');
const { roles } = require('../config/constants');
const { brandSchema } = require('../utils/validators');
const brandController = require('../controllers/brandController');

router.use(auth);

// GET /api/brands - List all brands
router.get('/', brandController.listBrands);

// GET /api/brands/:id - Get brand details
router.get('/:id', brandController.getBrandDetails);

// POST /api/brands - Create brand (Admin, Brand Manager)
router.post('/', 
  roleCheck([roles.ADMIN, roles.BRAND_MANAGER]), 
  validation(brandSchema),
  brandController.createBrand
);

// PUT /api/brands/:id - Update brand (Admin, Brand Manager)
router.put('/:id', 
  roleCheck([roles.ADMIN, roles.BRAND_MANAGER]), 
  brandController.updateBrand
);

// DELETE /api/brands/:id - Delete brand (Admin)
router.delete('/:id', 
  roleCheck([roles.ADMIN]), 
  brandController.deleteBrand
);

// PUT /api/brands/:id/toggle-rollover - Toggle rollover (Brand Manager, Admin)
router.put('/:id/toggle-rollover', 
  roleCheck([roles.ADMIN, roles.BRAND_MANAGER]), 
  brandController.toggleRollover
);

// PUT /api/brands/:id/toggle-seeding - Toggle seeding (Brand Manager, Admin)
router.put('/:id/toggle-seeding', 
  roleCheck([roles.ADMIN, roles.BRAND_MANAGER]), 
  brandController.toggleSeeding
);

// GET /api/brands/:id/shoppers - Get brand shoppers (Brand Manager, Admin)
router.get('/:id/shoppers', 
  roleCheck([roles.ADMIN, roles.BRAND_MANAGER]), 
  brandController.getBrandShoppers
);

// GET /api/brands/:id/performance - Get brand performance (Brand Manager, Admin)
router.get('/:id/performance', 
  roleCheck([roles.ADMIN, roles.BRAND_MANAGER, roles.EXECUTIVE]), 
  brandController.getBrandPerformance
);

module.exports = router;
