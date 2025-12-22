const db = require('../config/database');

class Brand {
  static async create(brandData) {
    const {
      name,
      category,
      pointsPerKes,
      minPurchaseAmount,
      maxPointsPerTransaction,
      brandManagerId,
      isActive = true,
      rolloverEnabled = false,
      seedingEnabled = false
    } = brandData;

    const [result] = await db.query(
      `INSERT INTO brands 
       (name, category, points_per_kes, min_purchase_amount, max_points_per_transaction, 
        brand_manager_id, is_active, rollover_enabled, seeding_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category, pointsPerKes, minPurchaseAmount, maxPointsPerTransaction,
       brandManagerId, isActive, rolloverEnabled, seedingEnabled]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT b.*, u.first_name as manager_first_name, u.last_name as manager_last_name 
       FROM brands b 
       LEFT JOIN users u ON b.brand_manager_id = u.id 
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findAll(filters = {}, page = 1, perPage = 30) {
    let query = `SELECT b.*, u.first_name as manager_first_name, u.last_name as manager_last_name 
                 FROM brands b 
                 LEFT JOIN users u ON b.brand_manager_id = u.id 
                 WHERE 1=1`;
    const params = [];

    if (filters.isActive !== undefined) {
      query += ' AND b.is_active = ?';
      params.push(filters.isActive);
    }

    if (filters.category) {
      query += ' AND b.category = ?';
      params.push(filters.category);
    }

    if (filters.brandManagerId) {
      query += ' AND b.brand_manager_id = ?';
      params.push(filters.brandManagerId);
    }

    query += ' ORDER BY b.name ASC LIMIT ? OFFSET ?';
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM brands WHERE 1=1';
    const countParams = [];
    
    if (filters.isActive !== undefined) {
      countQuery += ' AND is_active = ?';
      countParams.push(filters.isActive);
    }

    if (filters.category) {
      countQuery += ' AND category = ?';
      countParams.push(filters.category);
    }

    const [countResult] = await db.query(countQuery, countParams);
    
    return {
      brands: rows,
      total: countResult[0].total,
      page: parseInt(page),
      perPage: limit
    };
  }

  static async update(id, updates) {
    const allowedFields = [
      'name', 'category', 'points_per_kes', 'min_purchase_amount', 
      'max_points_per_transaction', 'brand_manager_id', 'is_active',
      'rollover_enabled', 'seeding_enabled'
    ];
    
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return;

    values.push(id);
    await db.query(
      `UPDATE brands SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
  }

  static async toggleRollover(id, enabled) {
    await db.query(
      'UPDATE brands SET rollover_enabled = ?, updated_at = NOW() WHERE id = ?',
      [enabled, id]
    );
  }

  static async toggleSeeding(id, enabled) {
    await db.query(
      'UPDATE brands SET seeding_enabled = ?, updated_at = NOW() WHERE id = ?',
      [enabled, id]
    );
  }

  static async getShoppers(brandId, page = 1, perPage = 30) {
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;

    const [rows] = await db.query(
      `SELECT DISTINCT s.id, u.first_name, u.last_name, u.email, 
              s.loyalty_tier, s.points_balance,
              COUNT(r.id) as purchase_count,
              SUM(ri.points_calculated) as total_points_from_brand
       FROM shoppers s
       JOIN users u ON s.user_id = u.id
       JOIN receipts r ON s.id = r.shopper_id
       JOIN receipt_items ri ON r.id = ri.receipt_id
       WHERE ri.brand_id = ? AND r.status = 'approved'
       GROUP BY s.id
       ORDER BY total_points_from_brand DESC
       LIMIT ? OFFSET ?`,
      [brandId, limit, offset]
    );

    return rows;
  }

  static async getPerformance(brandId) {
    const [rows] = await db.query(
      `SELECT 
        COUNT(DISTINCT ri.receipt_id) as total_receipts,
        COUNT(DISTINCT r.shopper_id) as unique_shoppers,
        SUM(ri.points_calculated) as total_points_awarded,
        SUM(ri.total_price) as total_revenue
       FROM receipt_items ri
       JOIN receipts r ON ri.receipt_id = r.id
       WHERE ri.brand_id = ? AND r.status = 'approved'`,
      [brandId]
    );

    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM brands WHERE id = ?', [id]);
  }
}

module.exports = Brand;
