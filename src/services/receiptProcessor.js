const Receipt = require('../models/Receipt');
const Shopper = require('../models/Shopper');
const PointsCalculator = require('./pointsCalculator');
const logger = require('../utils/logger');
const Helpers = require('../utils/helpers');

class ReceiptProcessor {
  /**
   * Process a receipt and allocate points
   * @param {number} receiptId - Receipt ID
   * @param {Array} items - Array of items {brandId, quantity, unitPrice, totalPrice}
   * @returns {Promise<Object>} - Processing result
   */
  static async processReceipt(receiptId, items) {
    try {
      // Get receipt details
      const receipt = await Receipt.findById(receiptId);
      if (!receipt) {
        throw new Error('Receipt not found');
      }

      // Get shopper details for tier multiplier
      const shopper = await Shopper.findById(receipt.shopper_id);
      if (!shopper) {
        throw new Error('Shopper not found');
      }

      // Calculate points for all items
      const { totalPoints, itemsWithPoints } = await PointsCalculator.calculateReceiptPoints(
        items,
        shopper.tier_multiplier
      );

      // Check for quality score (ETR validation)
      const qualityScore = ReceiptProcessor.validateReceiptQuality(receipt);
      
      if (qualityScore < 50) {
        // Low quality - flag for manual review
        await Receipt.flag(receiptId);
        return {
          success: false,
          message: 'Receipt flagged for manual review due to low quality',
          qualityScore
        };
      }

      // Check for duplicate
      const isDuplicate = await Receipt.checkDuplicate(
        receipt.receipt_number,
        receipt.store_id,
        receipt.total_amount
      );

      if (isDuplicate) {
        await Receipt.reject(receiptId);
        return {
          success: false,
          message: 'Duplicate receipt detected',
          reason: 'duplicate'
        };
      }

      // Add receipt items
      await Receipt.addItems(receiptId, itemsWithPoints);

      // Approve receipt and award points
      await Receipt.approve(receiptId, totalPoints, shopper.tier_multiplier);

      // Update shopper points
      await Shopper.updatePoints(shopper.id, totalPoints);

      logger.info(`Receipt ${receiptId} processed: ${totalPoints} points awarded to shopper ${shopper.id}`);

      return {
        success: true,
        pointsAwarded: totalPoints,
        tierMultiplier: shopper.tier_multiplier,
        qualityScore
      };
    } catch (error) {
      logger.error(`Error processing receipt ${receiptId}:`, error);
      throw error;
    }
  }

  /**
   * Validate receipt quality (ETR standard)
   * @param {Object} receipt - Receipt object
   * @returns {number} - Quality score (0-100)
   */
  static validateReceiptQuality(receipt) {
    let score = 100;

    // Check if image exists
    if (!receipt.receipt_image_path) {
      score -= 50;
    }

    // Check if receipt number exists
    if (!receipt.receipt_number) {
      score -= 20;
    }

    // Check capture method (phone is preferred for ETR)
    if (receipt.capture_method !== 'phone') {
      score -= 10;
    }

    // In production, this would:
    // - Use OCR to read receipt text
    // - Verify ETR format
    // - Check for machine-readable codes
    // - Validate merchant details
    // - Cross-check amounts

    return Math.max(0, score);
  }

  /**
   * Auto-approve receipts meeting quality threshold
   * @param {number} receiptId - Receipt ID
   * @param {Array} items - Receipt items
   * @returns {Promise<Object>} - Processing result
   */
  static async autoApprove(receiptId, items) {
    const result = await this.processReceipt(receiptId, items);
    
    if (result.success && result.qualityScore >= 80) {
      return {
        ...result,
        autoApproved: true
      };
    }

    return {
      ...result,
      autoApproved: false,
      requiresManualReview: true
    };
  }

  /**
   * Randomly flag receipts for audit (BEO Supervisor requirement)
   * @param {number} receiptId - Receipt ID
   * @returns {Promise<boolean>} - Whether receipt was flagged
   */
  static async randomFlag(receiptId) {
    // Random flagging: 5% of receipts
    const shouldFlag = Math.random() < 0.05;

    if (shouldFlag) {
      await Receipt.flag(receiptId);
      logger.info(`Receipt ${receiptId} randomly flagged for audit`);
      return true;
    }

    return false;
  }

  /**
   * Calculate PPG payment based on receipts processed
   * @param {number} ppgId - PPG user ID
   * @param {number} activeItems - Number of active brand items
   * @param {number} receiptsProcessed - Number of receipts processed
   * @param {number} target - Target receipts
   * @param {number} dailyWage - Daily wage amount
   * @returns {number} - Payment amount
   */
  static calculatePPGPayment(ppgId, activeItems, receiptsProcessed, target, dailyWage) {
    return Helpers.calculatePPGPayment(activeItems, receiptsProcessed, target, dailyWage);
  }

  /**
   * Get unprocessed receipts report
   * @param {Date} date - Date to check
   * @returns {Promise<Array>} - Unprocessed receipts
   */
  static async getUnprocessedReceipts(date = new Date()) {
    const { receipts } = await Receipt.findAll({ status: 'pending' }, 1, 100);
    return receipts;
  }
}

module.exports = ReceiptProcessor;
