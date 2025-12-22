const db = require('../config/database');

class Reward {
  static async create(rewardData) {
    const { name, type, pointsCost, inventoryCount, isActive = true } = rewardData;

    const [result] = await db.query(
      'INSERT INTO rewards (name, type, points_cost, inventory_count, is_active) VALUES (?, ?, ?, ?, ?)',
      [name, type, pointsCost, inventoryCount, isActive]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM rewards WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll(filters = {}, page = 1, perPage = 30) {
    let query = 'SELECT * FROM rewards WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive);
    }

    if (filters.maxPoints) {
      query += ' AND points_cost <= ?';
      params.push(filters.maxPoints);
    }

    query += ' ORDER BY points_cost ASC LIMIT ? OFFSET ?';
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    
    // Get total count with same filters
    let countQuery = 'SELECT COUNT(*) as total FROM rewards WHERE 1=1';
    const countParams = [];
    
    if (filters.type) {
      countQuery += ' AND type = ?';
      countParams.push(filters.type);
    }

    if (filters.isActive !== undefined) {
      countQuery += ' AND is_active = ?';
      countParams.push(filters.isActive);
    }

    if (filters.maxPoints) {
      countQuery += ' AND points_cost <= ?';
      countParams.push(filters.maxPoints);
    }

    const [countResult] = await db.query(countQuery, countParams);
    
    return {
      rewards: rows,
      total: countResult[0].total,
      page: parseInt(page),
      perPage: limit
    };
  }

  static async update(id, updates) {
    const allowedFields = ['name', 'type', 'points_cost', 'inventory_count', 'is_active'];
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
      `UPDATE rewards SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async decrementInventory(id, amount = 1) {
    const [result] = await db.query(
      'UPDATE rewards SET inventory_count = inventory_count - ? WHERE id = ? AND inventory_count >= ?',
      [amount, id, amount]
    );

    if (result.affectedRows === 0) {
      throw new Error('Insufficient inventory or reward not found');
    }
  }

  static async checkInventory(id) {
    const [rows] = await db.query(
      'SELECT inventory_count FROM rewards WHERE id = ?',
      [id]
    );
    return rows[0]?.inventory_count || 0;
  }

  static async delete(id) {
    await db.query('DELETE FROM rewards WHERE id = ?', [id]);
  }
}

module.exports = Reward;
