const db = require('../config/database');

class Store {
  static async create(storeData) {
    const { name, chain, location, neighborhood } = storeData;

    const [result] = await db.query(
      'INSERT INTO stores (name, chain, location, neighborhood) VALUES (?, ?, ?, ?)',
      [name, chain, location, neighborhood]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM stores WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll(filters = {}, page = 1, perPage = 30) {
    let query = 'SELECT * FROM stores WHERE 1=1';
    const params = [];

    if (filters.chain) {
      query += ' AND chain = ?';
      params.push(filters.chain);
    }

    if (filters.location) {
      query += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM stores WHERE 1=1';
    const countParams = [];
    
    if (filters.chain) {
      countQuery += ' AND chain = ?';
      countParams.push(filters.chain);
    }

    const [countResult] = await db.query(countQuery, countParams);
    
    return {
      stores: rows,
      total: countResult[0].total,
      page: parseInt(page),
      perPage: limit
    };
  }

  static async update(id, updates) {
    const allowedFields = ['name', 'chain', 'location', 'neighborhood'];
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
      `UPDATE stores SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async getPerformance(id) {
    const [rows] = await db.query(
      `SELECT 
        COUNT(*) as total_receipts,
        COUNT(DISTINCT shopper_id) as unique_shoppers,
        SUM(points_awarded) as total_points_issued,
        SUM(total_amount) as total_revenue
       FROM receipts
       WHERE store_id = ? AND status = 'approved'`,
      [id]
    );

    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM stores WHERE id = ?', [id]);
  }
}

module.exports = Store;
