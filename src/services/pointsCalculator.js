const Brand = require('../models/Brand');
const Helpers = require('../utils/helpers');

class PointsCalculator {
  /**
   * Calculate points for a receipt item
   * @param {number} brandId - Brand ID
   * @param {number} totalPrice - Total price of the item
   * @param {number} tierMultiplier - Shopper's tier multiplier
   * @returns {Promise<number>} - Points calculated
   */
  static async calculatePoints(brandId, totalPrice, tierMultiplier = 1.0) {
    const brand = await Brand.findById(brandId);
    
    if (!brand || !brand.is_active) {
      return 0;
    }

    // Check minimum purchase amount
    if (totalPrice < brand.min_purchase_amount) {
      return 0;
    }

    // Calculate base points: price * points_per_kes
    let basePoints = Math.floor(totalPrice * brand.points_per_kes);

    // Apply tier multiplier
    let totalPoints = Math.floor(basePoints * tierMultiplier);

    // Apply max points cap per transaction
    if (totalPoints > brand.max_points_per_transaction) {
      totalPoints = brand.max_points_per_transaction;
    }

    return totalPoints;
  }

  /**
   * Calculate total points for a receipt with multiple items
   * @param {Array} items - Array of receipt items {brandId, totalPrice}
   * @param {number} tierMultiplier - Shopper's tier multiplier
   * @returns {Promise<Object>} - { totalPoints, itemsWithPoints }
   */
  static async calculateReceiptPoints(items, tierMultiplier = 1.0) {
    const itemsWithPoints = [];
    let totalPoints = 0;

    for (const item of items) {
      const points = await this.calculatePoints(
        item.brandId,
        item.totalPrice,
        tierMultiplier
      );

      itemsWithPoints.push({
        ...item,
        pointsCalculated: points
      });

      totalPoints += points;
    }

    return {
      totalPoints,
      itemsWithPoints
    };
  }

  /**
   * Check if shopper should be promoted to next tier
   * @param {number} totalPointsEarned - Total points earned by shopper
   * @param {string} currentTierName - Current tier name
   * @returns {Object} - { tier, multiplier, promoted }
   */
  static checkTierPromotion(totalPointsEarned, currentTierName) {
    const newTier = Helpers.calculateTier(totalPointsEarned);
    const promoted = newTier.tier !== currentTierName;
    
    return {
      tier: newTier.tier,
      multiplier: newTier.multiplier,
      promoted
    };
  }

  /**
   * Calculate points expiring soon for a shopper
   * @param {number} shopperId - Shopper ID
   * @param {Date} expirationDate - Expiration date to check against
   * @returns {Promise<number>} - Points expiring
   */
  static async calculateExpiringPoints(shopperId, expirationDate) {
    // This would query receipts/points awarded before a certain date
    // For non-rollover brands only
    // Simplified implementation for now
    return 0;
  }
}

module.exports = PointsCalculator;
