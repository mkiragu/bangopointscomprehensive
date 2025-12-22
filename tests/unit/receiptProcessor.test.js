// Mock dependencies before requiring the service
jest.mock('../../src/config/database', () => ({
  query: jest.fn(),
  execute: jest.fn()
}));

jest.mock('../../src/services/emailService', () => ({
  sendPointsAwardedEmail: jest.fn(),
  sendReceiptRejectedEmail: jest.fn()
}));

jest.mock('../../src/models/Receipt', () => ({
  findById: jest.fn(),
  addItems: jest.fn(),
  approve: jest.fn(),
  flag: jest.fn(),
  findAll: jest.fn()
}));

jest.mock('../../src/models/Shopper', () => ({
  findById: jest.fn(),
  updatePoints: jest.fn()
}));

const Helpers = require('../../src/utils/helpers');
const ReceiptProcessor = require('../../src/services/receiptProcessor');

describe('ReceiptProcessor Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateReceiptQuality', () => {
    it('should give high score for complete receipt data', () => {
      const receiptData = {
        receipt_image_path: '/path/to/image.jpg',
        receipt_number: 'RCP12345',
        capture_method: 'phone'
      };

      const score = ReceiptProcessor.validateReceiptQuality(receiptData);

      expect(score).toBe(100); // Base 100, no deductions
    });

    it('should deduct 50 points for missing image', () => {
      const receiptData = {
        receipt_image_path: null,
        receipt_number: 'RCP12345',
        capture_method: 'phone'
      };

      const score = ReceiptProcessor.validateReceiptQuality(receiptData);

      expect(score).toBe(50); // 100 - 50
    });

    it('should deduct 20 points for missing receipt number', () => {
      const receiptData = {
        receipt_image_path: '/path/to/image.jpg',
        receipt_number: null,
        capture_method: 'phone'
      };

      const score = ReceiptProcessor.validateReceiptQuality(receiptData);

      expect(score).toBe(80); // 100 - 20
    });

    it('should deduct 10 points for email capture method', () => {
      const receiptData = {
        receipt_image_path: '/path/to/image.jpg',
        receipt_number: 'RCP12345',
        capture_method: 'email'
      };

      const score = ReceiptProcessor.validateReceiptQuality(receiptData);

      expect(score).toBe(90); // 100 - 10
    });

    it('should accumulate multiple deductions', () => {
      const receiptData = {
        receipt_image_path: null,
        receipt_number: null,
        capture_method: 'email'
      };

      const score = ReceiptProcessor.validateReceiptQuality(receiptData);

      expect(score).toBe(20); // 100 - 50 - 20 - 10
    });

    it('should not go below 0', () => {
      const receiptData = {
        receipt_image_path: null,
        receipt_number: null,
        capture_method: 'email'
      };

      const score = ReceiptProcessor.validateReceiptQuality(receiptData);

      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculatePPGPayment', () => {
    it('should calculate PPG payment correctly', () => {
      const ppgId = 1;
      const activeItems = 5;
      const receiptsProcessed = 100;
      const target = 200;
      const dailyWage = 1000;

      const payment = ReceiptProcessor.calculatePPGPayment(
        ppgId,
        activeItems,
        receiptsProcessed,
        target,
        dailyWage
      );

      // (5 * 100 / 200) * 1000 = 2.5 * 1000 = 2500
      expect(payment).toBe(2500);
    });

    it('should return 0 if no receipts processed', () => {
      const ppgId = 1;
      const activeItems = 5;
      const receiptsProcessed = 0;
      const target = 200;
      const dailyWage = 1000;

      const payment = ReceiptProcessor.calculatePPGPayment(
        ppgId,
        activeItems,
        receiptsProcessed,
        target,
        dailyWage
      );

      expect(payment).toBe(0);
    });

    it('should return 0 if no active items', () => {
      const ppgId = 1;
      const activeItems = 0;
      const receiptsProcessed = 100;
      const target = 200;
      const dailyWage = 1000;

      const payment = ReceiptProcessor.calculatePPGPayment(
        ppgId,
        activeItems,
        receiptsProcessed,
        target,
        dailyWage
      );

      expect(payment).toBe(0);
    });

    it('should handle target of 0 gracefully', () => {
      const ppgId = 1;
      const activeItems = 5;
      const receiptsProcessed = 100;
      const target = 0;
      const dailyWage = 1000;

      const payment = ReceiptProcessor.calculatePPGPayment(
        ppgId,
        activeItems,
        receiptsProcessed,
        target,
        dailyWage
      );

      expect(payment).toBe(0);
    });

    it('should calculate correctly when receipts exceed target', () => {
      const ppgId = 1;
      const activeItems = 5;
      const receiptsProcessed = 300;
      const target = 200;
      const dailyWage = 1000;

      const payment = ReceiptProcessor.calculatePPGPayment(
        ppgId,
        activeItems,
        receiptsProcessed,
        target,
        dailyWage
      );

      // (5 * 300 / 200) * 1000 = 7.5 * 1000 = 7500
      expect(payment).toBe(7500);
    });
  });
});
