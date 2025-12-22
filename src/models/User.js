const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { bcryptRounds } = require('../config/auth');

class User {
  static async create(userData) {
    const { email, password, role, firstName, lastName, phoneNumber } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, bcryptRounds);

    const [result] = await db.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone_number) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, role, firstName, lastName, phoneNumber]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, bcryptRounds);
    await db.query(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, userId]
    );
  }

  static async verifyEmail(userId) {
    await db.query(
      'UPDATE users SET email_verified = TRUE, updated_at = NOW() WHERE id = ?',
      [userId]
    );
  }

  static async updateProfile(userId, updates) {
    const allowedFields = ['first_name', 'last_name', 'phone_number'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return;

    values.push(userId);
    await db.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
  }

  static async setActive(userId, isActive) {
    await db.query(
      'UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?',
      [isActive, userId]
    );
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findAll(filters = {}, page = 1, perPage = 30) {
    let query = 'SELECT id, email, role, first_name, last_name, phone_number, is_active, email_verified, created_at FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive);
    }

    if (filters.search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];
    
    if (filters.role) {
      countQuery += ' AND role = ?';
      countParams.push(filters.role);
    }
    
    if (filters.isActive !== undefined) {
      countQuery += ' AND is_active = ?';
      countParams.push(filters.isActive);
    }

    if (filters.search) {
      countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await db.query(countQuery, countParams);
    
    return {
      users: rows,
      total: countResult[0].total,
      page: parseInt(page),
      perPage: limit
    };
  }

  static async delete(userId) {
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
  }
}

module.exports = User;
