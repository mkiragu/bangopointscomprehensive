const Receipt = require('../models/Receipt');
const Shopper = require('../models/Shopper');
const Store = require('../models/Store');
const ReceiptProcessor = require('../services/receiptProcessor');
const Notification = require('../models/Notification');
const Helpers = require('../utils/helpers');
const logger = require('../utils/logger');

class ReceiptController {
  // POST /api/receipts/upload
  static async uploadReceipt(req, res, next) {
    try {
      const { storeId, totalAmount, receiptNumber, captureMethod } = req.body;

      // Get shopper
      const shopper = await Shopper.findByUserId(req.user.id);
      if (!shopper) {
        return res.status(404).json(
          Helpers.errorResponse('Shopper profile not found')
        );
      }

      // Validate store
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json(
          Helpers.errorResponse('Store not found')
        );
      }

      // Get uploaded file path
      const receiptImagePath = req.file ? `/uploads/receipts/${req.file.filename}` : null;

      // Check for duplicate
      if (receiptNumber) {
        const isDuplicate = await Receipt.checkDuplicate(receiptNumber, storeId, totalAmount);
        if (isDuplicate) {
          return res.status(409).json(
            Helpers.errorResponse('Duplicate receipt detected')
          );
        }
      }

      // Calculate quality score
      const qualityScore = receiptImagePath ? 90 : 60; // Simplified

      // Create receipt
      const receiptId = await Receipt.create({
        shopperId: shopper.id,
        ppgId: null,
        storeId,
        receiptNumber: receiptNumber || Helpers.generateReceiptNumber(),
        totalAmount,
        receiptImagePath,
        captureMethod,
        qualityScore
      });

      logger.info(`Receipt uploaded: ${receiptId} by shopper ${shopper.id}`);

      res.status(201).json(
        Helpers.successResponse({
          receiptId,
          status: 'pending',
          message: 'Receipt uploaded successfully and is being processed'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/receipts
  static async listReceipts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;
      const status = req.query.status;

      const filters = {};
      
      // If shopper, only show their receipts
      if (req.user.role === 'shopper') {
        const shopper = await Shopper.findByUserId(req.user.id);
        if (shopper) {
          filters.shopperId = shopper.id;
        }
      }

      if (status) {
        filters.status = status;
      }

      const result = await Receipt.findAll(filters, page, perPage);

      res.json(
        Helpers.successResponse(result)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/receipts/:id
  static async getReceiptDetails(req, res, next) {
    try {
      const receiptId = req.params.id;

      const receipt = await Receipt.findById(receiptId);
      
      if (!receipt) {
        return res.status(404).json(
          Helpers.errorResponse('Receipt not found')
        );
      }

      // Get receipt items if approved
      let items = [];
      if (receipt.status === 'approved') {
        items = await Receipt.getItems(receiptId);
      }

      res.json(
        Helpers.successResponse({
          ...receipt,
          items
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/receipts/:id/approve
  static async approveReceipt(req, res, next) {
    try {
      const receiptId = req.params.id;
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json(
          Helpers.errorResponse('Receipt items are required')
        );
      }

      // Process receipt and allocate points
      const result = await ReceiptProcessor.processReceipt(receiptId, items);

      if (!result.success) {
        return res.status(400).json(
          Helpers.errorResponse(result.message)
        );
      }

      logger.info(`Receipt approved: ${receiptId}, Points: ${result.pointsAwarded}`);

      res.json(
        Helpers.successResponse(result, 'Receipt approved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/receipts/:id/reject
  static async rejectReceipt(req, res, next) {
    try {
      const receiptId = req.params.id;
      const { reason } = req.body;

      await Receipt.reject(receiptId);

      // Get receipt details for notification
      const receipt = await Receipt.findById(receiptId);
      if (receipt) {
        await Notification.create({
          userId: receipt.shopper_user_id,
          type: 'receipt_rejected',
          priority: 'high',
          subject: 'Receipt Rejected',
          message: `Your receipt #${receiptId} has been rejected. ${reason || 'Please contact support for details.'}`
        });
      }

      logger.info(`Receipt rejected: ${receiptId}`);

      res.json(
        Helpers.successResponse(null, 'Receipt rejected')
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/receipts/:id/flag
  static async flagReceipt(req, res, next) {
    try {
      const receiptId = req.params.id;

      await Receipt.flag(receiptId);

      // Get receipt details for notification
      const receipt = await Receipt.findById(receiptId);
      if (receipt) {
        await Notification.notifyReceiptFlagged(receipt.shopper_user_id, receiptId);
      }

      logger.info(`Receipt flagged: ${receiptId} by ${req.user.email}`);

      res.json(
        Helpers.successResponse(null, 'Receipt flagged for review')
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/receipts/pending
  static async getPendingReceipts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;

      const result = await Receipt.getPending(page, perPage);

      res.json(
        Helpers.successResponse(result)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/receipts/flagged
  static async getFlaggedReceipts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;

      const result = await Receipt.getFlagged(page, perPage);

      res.json(
        Helpers.successResponse(result)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReceiptController;
