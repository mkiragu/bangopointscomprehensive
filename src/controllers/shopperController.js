const Shopper = require('../models/Shopper');
const Reward = require('../models/Reward');
const User = require('../models/User');
const { loyaltyTiers } = require('../config/constants');
const Helpers = require('../utils/helpers');
const logger = require('../utils/logger');

class ShopperController {
  // GET /api/shoppers/profile
  static async getProfile(req, res, next) {
    try {
      const shopper = await Shopper.findByUserId(req.user.id);
      
      if (!shopper) {
        return res.status(404).json(
          Helpers.errorResponse('Shopper profile not found')
        );
      }

      res.json(
        Helpers.successResponse({
          id: shopper.id,
          email: shopper.email,
          firstName: shopper.first_name,
          lastName: shopper.last_name,
          phoneNumber: shopper.phone_number,
          pointsBalance: shopper.points_balance,
          loyaltyTier: shopper.loyalty_tier,
          tierMultiplier: shopper.tier_multiplier,
          totalPointsEarned: shopper.total_points_earned,
          createdAt: shopper.created_at
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/shoppers/profile
  static async updateProfile(req, res, next) {
    try {
      const { firstName, lastName, phoneNumber } = req.body;
      
      await User.updateProfile(req.user.id, {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      });

      logger.info(`Shopper profile updated: ${req.user.id}`);

      res.json(
        Helpers.successResponse(null, 'Profile updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/shoppers/points
  static async getPoints(req, res, next) {
    try {
      const shopper = await Shopper.findByUserId(req.user.id);
      
      if (!shopper) {
        return res.status(404).json(
          Helpers.errorResponse('Shopper not found')
        );
      }

      res.json(
        Helpers.successResponse({
          pointsBalance: shopper.points_balance,
          totalPointsEarned: shopper.total_points_earned,
          loyaltyTier: shopper.loyalty_tier,
          tierMultiplier: shopper.tier_multiplier,
          nextTierAt: shopper.loyalty_tier === 'bronze' ? loyaltyTiers.SILVER.minPoints : 
                      shopper.loyalty_tier === 'silver' ? loyaltyTiers.GOLD.minPoints : null
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/shoppers/receipts
  static async getReceipts(req, res, next) {
    try {
      const shopper = await Shopper.findByUserId(req.user.id);
      
      if (!shopper) {
        return res.status(404).json(
          Helpers.errorResponse('Shopper not found')
        );
      }

      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;

      const result = await Shopper.getReceipts(shopper.id, page, perPage);

      res.json(
        Helpers.successResponse(result)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/shoppers/eligible-brands
  static async getEligibleBrands(req, res, next) {
    try {
      const shopper = await Shopper.findByUserId(req.user.id);
      
      if (!shopper) {
        return res.status(404).json(
          Helpers.errorResponse('Shopper not found')
        );
      }

      const brands = await Shopper.getEligibleBrands(shopper.id);

      res.json(
        Helpers.successResponse(brands)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/shoppers/tier-info
  static async getTierInfo(req, res, next) {
    try {
      const shopper = await Shopper.findByUserId(req.user.id);
      
      if (!shopper) {
        return res.status(404).json(
          Helpers.errorResponse('Shopper not found')
        );
      }

      const tierInfo = await Shopper.getTierInfo(shopper.id);

      const benefits = {
        bronze: ['1.0x points multiplier', 'Standard rewards access'],
        silver: ['1.25x points multiplier', 'Priority support', 'Exclusive offers'],
        gold: ['1.5x points multiplier', 'VIP support', 'Premium rewards', 'Early access to campaigns']
      };

      const currentTier = tierInfo.loyalty_tier;
      const nextTier = currentTier === 'bronze' ? 'silver' : 
                       currentTier === 'silver' ? 'gold' : null;
      
      let pointsToNextTier = 0;
      if (nextTier === 'silver') {
        pointsToNextTier = Math.max(0, loyaltyTiers.SILVER.minPoints - tierInfo.total_points_earned);
      } else if (nextTier === 'gold') {
        pointsToNextTier = Math.max(0, loyaltyTiers.GOLD.minPoints - tierInfo.total_points_earned);
      }

      res.json(
        Helpers.successResponse({
          ...tierInfo,
          benefits: benefits[tierInfo.loyalty_tier],
          nextTier,
          pointsToNextTier
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/shoppers/rewards
  static async getAvailableRewards(req, res, next) {
    try {
      const shopper = await Shopper.findByUserId(req.user.id);
      
      if (!shopper) {
        return res.status(404).json(
          Helpers.errorResponse('Shopper not found')
        );
      }

      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;

      const result = await Reward.findAll({
        isActive: true,
        maxPoints: shopper.points_balance
      }, page, perPage);

      res.json(
        Helpers.successResponse({
          ...result,
          shopperPointsBalance: shopper.points_balance
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // POST /api/shoppers/redeem-reward
  static async redeemReward(req, res, next) {
    try {
      const { rewardId } = req.body;

      if (!rewardId) {
        return res.status(400).json(
          Helpers.errorResponse('Reward ID is required')
        );
      }

      const shopper = await Shopper.findByUserId(req.user.id);
      
      if (!shopper) {
        return res.status(404).json(
          Helpers.errorResponse('Shopper not found')
        );
      }

      // Get reward details
      const reward = await Reward.findById(rewardId);
      
      if (!reward) {
        return res.status(404).json(
          Helpers.errorResponse('Reward not found')
        );
      }

      if (!reward.is_active) {
        return res.status(400).json(
          Helpers.errorResponse('Reward is not active')
        );
      }

      // Check if shopper has enough points
      if (shopper.points_balance < reward.points_cost) {
        return res.status(400).json(
          Helpers.errorResponse('Insufficient points balance')
        );
      }

      // Check inventory
      const inventory = await Reward.checkInventory(rewardId);
      if (inventory < 1) {
        return res.status(400).json(
          Helpers.errorResponse('Reward out of stock')
        );
      }

      // Deduct points
      await Shopper.deductPoints(shopper.id, reward.points_cost);

      // Decrement inventory
      await Reward.decrementInventory(rewardId);

      // In production, create redemption record and process reward delivery
      logger.info(`Reward redeemed: Shopper ${shopper.id}, Reward ${rewardId}, Points: ${reward.points_cost}`);

      res.json(
        Helpers.successResponse({
          rewardName: reward.name,
          pointsSpent: reward.points_cost,
          newBalance: shopper.points_balance - reward.points_cost
        }, 'Reward redeemed successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ShopperController;
