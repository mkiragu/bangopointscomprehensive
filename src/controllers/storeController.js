const Store = require('../models/Store');
const logger = require('../utils/logger');

class StoreController {
  /**
   * List all stores with optional filtering
   * GET /api/stores
   */
  static async listStores(req, res, next) {
    try {
      const { chain, location, page = 1, perPage = 30 } = req.query;

      const filters = {};
      if (chain) filters.chain = chain;
      if (location) filters.location = location;

      const result = await Store.findAll(filters, page, perPage);

      logger.info(`Listed stores: ${result.stores.length} results`, { 
        userId: req.user.id,
        filters 
      });

      res.json({
        success: true,
        data: result.stores,
        pagination: {
          total: result.total,
          page: result.page,
          perPage: result.perPage,
          totalPages: Math.ceil(result.total / result.perPage)
        }
      });
    } catch (error) {
      logger.error('Error listing stores:', error);
      next(error);
    }
  }

  /**
   * Get store details
   * GET /api/stores/:id
   */
  static async getStore(req, res, next) {
    try {
      const { id } = req.params;

      const store = await Store.findById(id);

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      logger.info(`Retrieved store details`, { userId: req.user.id, storeId: id });

      res.json({
        success: true,
        data: store
      });
    } catch (error) {
      logger.error('Error getting store:', error);
      next(error);
    }
  }

  /**
   * Create new store (Admin only)
   * POST /api/stores
   */
  static async createStore(req, res, next) {
    try {
      const { name, chain, location, neighborhood } = req.body;

      const storeId = await Store.create({
        name,
        chain,
        location,
        neighborhood
      });

      const store = await Store.findById(storeId);

      logger.info(`Store created`, { userId: req.user.id, storeId });

      res.status(201).json({
        success: true,
        message: 'Store created successfully',
        data: store
      });
    } catch (error) {
      logger.error('Error creating store:', error);
      next(error);
    }
  }

  /**
   * Update store (Admin only)
   * PUT /api/stores/:id
   */
  static async updateStore(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const store = await Store.findById(id);

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      await Store.update(id, updates);

      const updatedStore = await Store.findById(id);

      logger.info(`Store updated`, { userId: req.user.id, storeId: id });

      res.json({
        success: true,
        message: 'Store updated successfully',
        data: updatedStore
      });
    } catch (error) {
      logger.error('Error updating store:', error);
      next(error);
    }
  }

  /**
   * Delete store (Admin only)
   * DELETE /api/stores/:id
   */
  static async deleteStore(req, res, next) {
    try {
      const { id } = req.params;

      const store = await Store.findById(id);

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      await Store.delete(id);

      logger.info(`Store deleted`, { userId: req.user.id, storeId: id });

      res.json({
        success: true,
        message: 'Store deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting store:', error);
      next(error);
    }
  }

  /**
   * Get store performance metrics
   * GET /api/stores/:id/performance
   */
  static async getStorePerformance(req, res, next) {
    try {
      const { id } = req.params;

      const store = await Store.findById(id);

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      const performance = await Store.getPerformance(id);

      logger.info(`Retrieved store performance`, { userId: req.user.id, storeId: id });

      res.json({
        success: true,
        data: {
          store: {
            id: store.id,
            name: store.name,
            chain: store.chain,
            location: store.location
          },
          performance: {
            totalReceipts: performance.total_receipts || 0,
            uniqueShoppers: performance.unique_shoppers || 0,
            totalPointsIssued: performance.total_points_issued || 0,
            totalRevenue: parseFloat(performance.total_revenue) || 0
          }
        }
      });
    } catch (error) {
      logger.error('Error getting store performance:', error);
      next(error);
    }
  }
}

module.exports = StoreController;
