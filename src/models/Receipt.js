const db = require('../config/database');

class Receipt {
  static async create(receiptData) {
    const {
      shopperId,
      ppgId,
      storeId,
      receiptNumber,
      totalAmount,
      receiptImagePath,
      captureMethod,
      qualityScore
    } = receiptData;

    const [result] = await db.query(
      `INSERT INTO receipts 
       (shopper_id, ppg_id, store_id, receipt_number, total_amount, receipt_image_path, 
        capture_method, quality_score, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [shopperId, ppgId, storeId, receiptNumber, totalAmount, receiptImagePath, 
       captureMethod, qualityScore]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT r.*, 
              s.name as store_name, s.chain as store_chain,
              sh.user_id as shopper_user_id,
              u.first_name as shopper_first_name, u.last_name as shopper_last_name
       FROM receipts r
       JOIN stores s ON r.store_id = s.id
       JOIN shoppers sh ON r.shopper_id = sh.id
       JOIN users u ON sh.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findAll(filters = {}, page = 1, perPage = 30) {
    let query = `SELECT r.*, 
                        s.name as store_name, s.chain as store_chain,
                        u.first_name as shopper_first_name, u.last_name as shopper_last_name
                 FROM receipts r
                 JOIN stores s ON r.store_id = s.id
                 JOIN shoppers sh ON r.shopper_id = sh.id
                 JOIN users u ON sh.user_id = u.id
                 WHERE 1=1`;
    const params = [];

    if (filters.status) {
      query += ' AND r.status = ?';
      params.push(filters.status);
    }

    if (filters.shopperId) {
      query += ' AND r.shopper_id = ?';
      params.push(filters.shopperId);
    }

    if (filters.storeId) {
      query += ' AND r.store_id = ?';
      params.push(filters.storeId);
    }

    if (filters.ppgId) {
      query += ' AND r.ppg_id = ?';
      params.push(filters.ppgId);
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM receipts WHERE 1=1',
      []
    );
    
    return {
      receipts: rows,
      total: countResult[0].total,
      page: parseInt(page),
      perPage: limit
    };
  }

  static async updateStatus(id, status, processedBy = null) {
    await db.query(
      'UPDATE receipts SET status = ?, processed_at = NOW() WHERE id = ?',
      [status, id]
    );

    if (processedBy) {
      // Log the processor
      await db.query(
        'UPDATE receipts SET ppg_id = ? WHERE id = ?',
        [processedBy, id]
      );
    }
  }

  static async approve(id, pointsAwarded, tierMultiplier) {
    await db.query(
      `UPDATE receipts 
       SET status = 'approved', 
           points_awarded = ?, 
           tier_multiplier_applied = ?,
           processed_at = NOW()
       WHERE id = ?`,
      [pointsAwarded, tierMultiplier, id]
    );
  }

  static async reject(id) {
    await db.query(
      `UPDATE receipts 
       SET status = 'rejected', processed_at = NOW()
       WHERE id = ?`,
      [id]
    );
  }

  static async flag(id) {
    await db.query(
      `UPDATE receipts 
       SET status = 'flagged'
       WHERE id = ?`,
      [id]
    );
  }

  static async addItems(receiptId, items) {
    const values = items.map(item => [
      receiptId,
      item.brandId,
      item.quantity,
      item.unitPrice,
      item.totalPrice,
      item.pointsCalculated
    ]);

    await db.query(
      `INSERT INTO receipt_items 
       (receipt_id, brand_id, quantity, unit_price, total_price, points_calculated)
       VALUES ?`,
      [values]
    );
  }

  static async getItems(receiptId) {
    const [rows] = await db.query(
      `SELECT ri.*, b.name as brand_name, b.category as brand_category
       FROM receipt_items ri
       JOIN brands b ON ri.brand_id = b.id
       WHERE ri.receipt_id = ?`,
      [receiptId]
    );
    return rows;
  }

  static async getPending(page = 1, perPage = 30) {
    return this.findAll({ status: 'pending' }, page, perPage);
  }

  static async getFlagged(page = 1, perPage = 30) {
    return this.findAll({ status: 'flagged' }, page, perPage);
  }

  static async checkDuplicate(receiptNumber, storeId, totalAmount) {
    const [rows] = await db.query(
      `SELECT id FROM receipts 
       WHERE receipt_number = ? 
       AND store_id = ? 
       AND total_amount = ?
       AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
       LIMIT 1`,
      [receiptNumber, storeId, totalAmount]
    );
    return rows.length > 0;
  }
}

module.exports = Receipt;
