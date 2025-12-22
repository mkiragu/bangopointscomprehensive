// Mock dependencies before requiring the service
jest.mock('../../src/config/database', () => ({
  query: jest.fn(),
  execute: jest.fn()
}));

const Helpers = require('../../src/utils/helpers');
const PointsCalculator = require('../../src/services/pointsCalculator');

// Mock Brand model
jest.mock('../../src/models/Brand', () => ({
  findById: jest.fn()
}));

const Brand = require('../../src/models/Brand');

describe('PointsCalculator Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePoints', () => {
    it('should calculate points correctly for a brand', async () => {
      const mockBrand = {
        id: 1,
        points_per_kes: 10,
        min_purchase_amount: 50,
        max_points_per_transaction: 5000,
        is_active: true
      };

      Brand.findById.mockResolvedValue(mockBrand);

      const points = await PointsCalculator.calculatePoints(1, 100, 1.0);

      expect(points).toBe(1000); // 100 * 10 * 1.0
      expect(Brand.findById).toHaveBeenCalledWith(1);
    });

    it('should apply tier multiplier correctly', async () => {
      const mockBrand = {
        id: 1,
        points_per_kes: 10,
        min_purchase_amount: 50,
        max_points_per_transaction: 5000,
        is_active: true
      };

      Brand.findById.mockResolvedValue(mockBrand);

      const points = await PointsCalculator.calculatePoints(1, 100, 1.5);

      expect(points).toBe(1500); // 100 * 10 * 1.5
    });

    it('should cap points at max_points_per_transaction', async () => {
      const mockBrand = {
        id: 1,
        points_per_kes: 10,
        min_purchase_amount: 50,
        max_points_per_transaction: 1000,
        is_active: true
      };

      Brand.findById.mockResolvedValue(mockBrand);

      const points = await PointsCalculator.calculatePoints(1, 200, 1.0);

      expect(points).toBe(1000); // Capped at 1000 instead of 2000
    });

    it('should return 0 if below minimum purchase amount', async () => {
      const mockBrand = {
        id: 1,
        points_per_kes: 10,
        min_purchase_amount: 100,
        max_points_per_transaction: 5000,
        is_active: true
      };

      Brand.findById.mockResolvedValue(mockBrand);

      const points = await PointsCalculator.calculatePoints(1, 50, 1.0);

      expect(points).toBe(0);
    });

    it('should return 0 for inactive brand', async () => {
      const mockBrand = {
        id: 1,
        points_per_kes: 10,
        min_purchase_amount: 50,
        max_points_per_transaction: 5000,
        is_active: false
      };

      Brand.findById.mockResolvedValue(mockBrand);

      const points = await PointsCalculator.calculatePoints(1, 100, 1.0);

      expect(points).toBe(0);
    });

    it('should return 0 for non-existent brand', async () => {
      Brand.findById.mockResolvedValue(null);

      const points = await PointsCalculator.calculatePoints(999, 100, 1.0);

      expect(points).toBe(0);
    });
  });

  describe('calculateReceiptPoints', () => {
    it('should sum points from multiple items', async () => {
      const mockBrand1 = {
        id: 1,
        points_per_kes: 10,
        min_purchase_amount: 50,
        max_points_per_transaction: 5000,
        is_active: true
      };

      const mockBrand2 = {
        id: 2,
        points_per_kes: 8,
        min_purchase_amount: 50,
        max_points_per_transaction: 5000,
        is_active: true
      };

      Brand.findById.mockImplementation((id) => {
        if (id === 1) {return Promise.resolve(mockBrand1);}
        if (id === 2) {return Promise.resolve(mockBrand2);}
        return Promise.resolve(null);
      });

      const items = [
        { brandId: 1, totalPrice: 100 },
        { brandId: 2, totalPrice: 150 }
      ];

      const result = await PointsCalculator.calculateReceiptPoints(items, 1.0);

      expect(result.totalPoints).toBe(2200); // (100*10) + (150*8)
      expect(result.itemsWithPoints).toHaveLength(2);
    });

    it('should return 0 for empty receipt', async () => {
      const result = await PointsCalculator.calculateReceiptPoints([], 1.0);

      expect(result.totalPoints).toBe(0);
      expect(result.itemsWithPoints).toHaveLength(0);
    });
  });

  describe('checkTierPromotion', () => {
    it('should detect promotion from bronze to silver', () => {
      const result = PointsCalculator.checkTierPromotion(15000, 'bronze');

      expect(result.tier).toBe('silver');
      expect(result.promoted).toBe(true);
    });

    it('should detect promotion from silver to gold', () => {
      const result = PointsCalculator.checkTierPromotion(55000, 'silver');

      expect(result.tier).toBe('gold');
      expect(result.promoted).toBe(true);
    });

    it('should return false when no promotion', () => {
      const result = PointsCalculator.checkTierPromotion(5000, 'bronze');

      expect(result.tier).toBe('bronze');
      expect(result.promoted).toBe(false);
    });

    it('should return false when already at tier', () => {
      const result = PointsCalculator.checkTierPromotion(75000, 'gold');

      expect(result.tier).toBe('gold');
      expect(result.promoted).toBe(false);
    });
  });

  describe('calculateExpiringPoints', () => {
    it('should return 0 (simplified implementation)', async () => {
      const expiringPoints = await PointsCalculator.calculateExpiringPoints(1, new Date());

      expect(expiringPoints).toBe(0);
    });
  });
});
