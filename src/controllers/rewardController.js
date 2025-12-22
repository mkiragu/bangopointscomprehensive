const Reward = require('../models/Reward');
const logger = require('../utils/logger');

class RewardController {
  /**
   * List all rewards with optional filtering
   * GET /api/rewards
   */
  static async listRewards(req, res, next) {
    try {
      const { type, isActive, maxPoints, page = 1, perPage = 30 } = req.query;

      const filters = {};
      if (type) filters.type = type;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (maxPoints) filters.maxPoints = parseInt(maxPoints);

      const result = await Reward.findAll(filters, page, perPage);

      logger.info(`Listed rewards: ${result.rewards.length} results`, { 
        userId: req.user.id,
        filters 
      });

      res.json({
        success: true,
        data: result.rewards,
        pagination: {
          total: result.total,
          page: result.page,
          perPage: result.perPage,
          totalPages: Math.ceil(result.total / result.perPage)
        }
      });
    } catch (error) {
      logger.error('Error listing rewards:', error);
      next(error);
    }
  }

  /**
   * Get reward details
   * GET /api/rewards/:id
   */
  static async getReward(req, res, next) {
    try {
      const { id } = req.params;

      const reward = await Reward.findById(id);

      if (!reward) {
        return res.status(404).json({
          success: false,
          message: 'Reward not found'
        });
      }

      logger.info(`Retrieved reward details`, { userId: req.user.id, rewardId: id });

      res.json({
        success: true,
        data: reward
      });
    } catch (error) {
      logger.error('Error getting reward:', error);
      next(error);
    }
  }

  /**
   * Create new reward (Admin only)
   * POST /api/rewards
   */
  static async createReward(req, res, next) {
    try {
      const { name, type, pointsCost, inventoryCount, isActive } = req.body;

      const rewardId = await Reward.create({
        name,
        type,
        pointsCost,
        inventoryCount,
        isActive
      });

      const reward = await Reward.findById(rewardId);

      logger.info(`Reward created`, { userId: req.user.id, rewardId });

      res.status(201).json({
        success: true,
        message: 'Reward created successfully',
        data: reward
      });
    } catch (error) {
      logger.error('Error creating reward:', error);
      next(error);
    }
  }

  /**
   * Update reward (Admin only)
   * PUT /api/rewards/:id
   */
  static async updateReward(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const reward = await Reward.findById(id);

      if (!reward) {
        return res.status(404).json({
          success: false,
          message: 'Reward not found'
        });
      }

      await Reward.update(id, updates);

      const updatedReward = await Reward.findById(id);

      logger.info(`Reward updated`, { userId: req.user.id, rewardId: id });

      res.json({
        success: true,
        message: 'Reward updated successfully',
        data: updatedReward
      });
    } catch (error) {
      logger.error('Error updating reward:', error);
      next(error);
    }
  }

  /**
   * Delete reward (Admin only)
   * DELETE /api/rewards/:id
   */
  static async deleteReward(req, res, next) {
    try {
      const { id } = req.params;

      const reward = await Reward.findById(id);

      if (!reward) {
        return res.status(404).json({
          success: false,
          message: 'Reward not found'
        });
      }

      await Reward.delete(id);

      logger.info(`Reward deleted`, { userId: req.user.id, rewardId: id });

      res.json({
        success: true,
        message: 'Reward deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting reward:', error);
      next(error);
    }
  }

  /**
   * Check reward inventory
   * GET /api/rewards/:id/inventory
   */
  static async checkInventory(req, res, next) {
    try {
      const { id } = req.params;

      const reward = await Reward.findById(id);

      if (!reward) {
        return res.status(404).json({
          success: false,
          message: 'Reward not found'
        });
      }

      const inventoryCount = await Reward.checkInventory(id);

      logger.info(`Checked reward inventory`, { userId: req.user.id, rewardId: id });

      res.json({
        success: true,
        data: {
          rewardId: id,
          name: reward.name,
          inventoryCount,
          available: inventoryCount > 0
        }
      });
    } catch (error) {
      logger.error('Error checking inventory:', error);
      next(error);
    }
  }
}

module.exports = RewardController;
