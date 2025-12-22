const Brand = require('../models/Brand');
const Helpers = require('../utils/helpers');
const logger = require('../utils/logger');

class BrandController {
  // GET /api/brands
  static async listBrands(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;
      
      const filters = {};
      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === 'true';
      }
      if (req.query.category) {
        filters.category = req.query.category;
      }
      if (req.query.brandManagerId) {
        filters.brandManagerId = parseInt(req.query.brandManagerId);
      }

      const result = await Brand.findAll(filters, page, perPage);

      res.json(
        Helpers.successResponse(result)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/brands/:id
  static async getBrandDetails(req, res, next) {
    try {
      const brandId = req.params.id;

      const brand = await Brand.findById(brandId);
      
      if (!brand) {
        return res.status(404).json(
          Helpers.errorResponse('Brand not found')
        );
      }

      res.json(
        Helpers.successResponse(brand)
      );
    } catch (error) {
      next(error);
    }
  }

  // POST /api/brands
  static async createBrand(req, res, next) {
    try {
      const brandData = req.body;

      const brandId = await Brand.create(brandData);

      logger.info(`Brand created: ${brandId} by ${req.user.email}`);

      res.status(201).json(
        Helpers.successResponse({ brandId }, 'Brand created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/brands/:id
  static async updateBrand(req, res, next) {
    try {
      const brandId = req.params.id;
      const updates = req.body;

      await Brand.update(brandId, updates);

      logger.info(`Brand updated: ${brandId} by ${req.user.email}`);

      res.json(
        Helpers.successResponse(null, 'Brand updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/brands/:id
  static async deleteBrand(req, res, next) {
    try {
      const brandId = req.params.id;

      await Brand.delete(brandId);

      logger.info(`Brand deleted: ${brandId} by ${req.user.email}`);

      res.json(
        Helpers.successResponse(null, 'Brand deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/brands/:id/toggle-rollover
  static async toggleRollover(req, res, next) {
    try {
      const brandId = req.params.id;
      const { enabled } = req.body;

      if (enabled === undefined) {
        return res.status(400).json(
          Helpers.errorResponse('enabled field is required')
        );
      }

      await Brand.toggleRollover(brandId, enabled);

      logger.info(`Brand rollover toggled: ${brandId}, enabled: ${enabled}`);

      res.json(
        Helpers.successResponse(null, `Rollover ${enabled ? 'enabled' : 'disabled'}`)
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/brands/:id/toggle-seeding
  static async toggleSeeding(req, res, next) {
    try {
      const brandId = req.params.id;
      const { enabled } = req.body;

      if (enabled === undefined) {
        return res.status(400).json(
          Helpers.errorResponse('enabled field is required')
        );
      }

      await Brand.toggleSeeding(brandId, enabled);

      logger.info(`Brand seeding toggled: ${brandId}, enabled: ${enabled}`);

      res.json(
        Helpers.successResponse(null, `Seeding ${enabled ? 'enabled' : 'disabled'}`)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/brands/:id/shoppers
  static async getBrandShoppers(req, res, next) {
    try {
      const brandId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;

      const shoppers = await Brand.getShoppers(brandId, page, perPage);

      res.json(
        Helpers.successResponse(shoppers)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/brands/:id/performance
  static async getBrandPerformance(req, res, next) {
    try {
      const brandId = req.params.id;

      const performance = await Brand.getPerformance(brandId);

      res.json(
        Helpers.successResponse(performance)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BrandController;
