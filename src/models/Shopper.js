const db = require('../config/database');
const Helpers = require('../utils/helpers');

class Shopper {
  static async create(userId) {
    const [result] = await db.query(
      'INSERT INTO shoppers (user_id, points_balance, loyalty_tier, tier_multiplier, total_points_earned) VALUES (?, 0, ?, 1.00, 0)',
      [userId, 'bronze']
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT s.*, u.email, u.first_name, u.last_name, u.phone_number 
       FROM shoppers s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.user_id = ?`,
      [userId]
    );
    return rows[0];
  }

  static async findById(shopperId) {
    const [rows] = await db.query(
      `SELECT s.*, u.email, u.first_name, u.last_name, u.phone_number 
       FROM shoppers s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.id = ?`,
      [shopperId]
    );
    return rows[0];
  }

  static async updatePoints(shopperId, pointsToAdd) {
    await db.query(
      `UPDATE shoppers 
       SET points_balance = points_balance + ?, 
           total_points_earned = total_points_earned + ?,
           updated_at = NOW()
       WHERE id = ?`,
      [pointsToAdd, pointsToAdd, shopperId]
    );

    // Update tier based on total points
    const [shopper] = await db.query(
      'SELECT total_points_earned FROM shoppers WHERE id = ?',
      [shopperId]
    );

    if (shopper.length > 0) {
      const tierInfo = Helpers.calculateTier(shopper[0].total_points_earned);
      await db.query(
        'UPDATE shoppers SET loyalty_tier = ?, tier_multiplier = ? WHERE id = ?',
        [tierInfo.tier, tierInfo.multiplier, shopperId]
      );
    }
  }

  static async deductPoints(shopperId, points) {
    const [result] = await db.query(
      `UPDATE shoppers 
       SET points_balance = points_balance - ?
       WHERE id = ? AND points_balance >= ?`,
      [points, shopperId, points]
    );

    if (result.affectedRows === 0) {
      throw new Error('Insufficient points balance');
    }
  }

  static async getPointsBalance(shopperId) {
    const [rows] = await db.query(
      'SELECT points_balance FROM shoppers WHERE id = ?',
      [shopperId]
    );
    return rows[0]?.points_balance || 0;
  }

  static async getReceipts(shopperId, page = 1, perPage = 30) {
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;

    const [rows] = await db.query(
      `SELECT r.*, s.name as store_name, s.chain as store_chain 
       FROM receipts r 
       JOIN stores s ON r.store_id = s.id 
       WHERE r.shopper_id = ? 
       ORDER BY r.created_at DESC 
       LIMIT ? OFFSET ?`,
      [shopperId, limit, offset]
    );

    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM receipts WHERE shopper_id = ?',
      [shopperId]
    );

    return {
      receipts: rows,
      total: countResult[0].total,
      page: parseInt(page),
      perPage: limit
    };
  }

  static async getEligibleBrands(shopperId) {
    const [rows] = await db.query(
      `SELECT DISTINCT b.id, b.name, b.category, b.points_per_kes, 
              b.min_purchase_amount, b.max_points_per_transaction,
              COUNT(ri.id) as purchase_count,
              SUM(ri.points_calculated) as total_points_earned
       FROM brands b
       LEFT JOIN receipt_items ri ON b.id = ri.brand_id
       LEFT JOIN receipts r ON ri.receipt_id = r.id AND r.shopper_id = ? AND r.status = 'approved'
       WHERE b.is_active = TRUE
       GROUP BY b.id
       ORDER BY purchase_count DESC`,
      [shopperId]
    );
    return rows;
  }

  static async getTierInfo(shopperId) {
    const [rows] = await db.query(
      'SELECT loyalty_tier, tier_multiplier, total_points_earned, points_balance FROM shoppers WHERE id = ?',
      [shopperId]
    );
    return rows[0];
  }

  static async findAll(page = 1, perPage = 30) {
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;

    const [rows] = await db.query(
      `SELECT s.id, s.user_id, s.points_balance, s.loyalty_tier, s.tier_multiplier, 
              s.total_points_earned, s.created_at,
              u.email, u.first_name, u.last_name, u.phone_number
       FROM shoppers s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.total_points_earned DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await db.query('SELECT COUNT(*) as total FROM shoppers');

    return {
      shoppers: rows,
      total: countResult[0].total,
      page: parseInt(page),
      perPage: limit
    };
  }
}

module.exports = Shopper;
