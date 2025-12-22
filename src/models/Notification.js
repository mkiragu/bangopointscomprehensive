const db = require('../config/database');

class Notification {
  static async create(notificationData) {
    const { userId, senderId, type, priority = 'medium', subject, message } = notificationData;

    const [result] = await db.query(
      `INSERT INTO notifications (user_id, sender_id, type, priority, subject, message) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, senderId, type, priority, subject, message]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT n.*, 
              u.first_name as recipient_first_name, u.last_name as recipient_last_name,
              s.first_name as sender_first_name, s.last_name as sender_last_name
       FROM notifications n
       JOIN users u ON n.user_id = u.id
       LEFT JOIN users s ON n.sender_id = s.id
       WHERE n.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId, filters = {}, page = 1, perPage = 30) {
    let query = `SELECT n.*, 
                        s.first_name as sender_first_name, s.last_name as sender_last_name
                 FROM notifications n
                 LEFT JOIN users s ON n.sender_id = s.id
                 WHERE n.user_id = ?`;
    const params = [userId];

    if (filters.isRead !== undefined) {
      query += ' AND n.is_read = ?';
      params.push(filters.isRead);
    }

    if (filters.priority) {
      query += ' AND n.priority = ?';
      params.push(filters.priority);
    }

    if (filters.type) {
      query += ' AND n.type = ?';
      params.push(filters.type);
    }

    query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?';
    const countParams = [userId];
    
    if (filters.isRead !== undefined) {
      countQuery += ' AND is_read = ?';
      countParams.push(filters.isRead);
    }

    const [countResult] = await db.query(countQuery, countParams);
    
    return {
      notifications: rows,
      total: countResult[0].total,
      page: parseInt(page),
      perPage: limit
    };
  }

  static async markAsRead(id) {
    await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [id]
    );
  }

  static async markAllAsRead(userId) {
    await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
  }

  static async getUnreadCount(userId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    return rows[0].count;
  }

  static async delete(id) {
    await db.query('DELETE FROM notifications WHERE id = ?', [id]);
  }

  static async deleteOld(daysOld = 90) {
    await db.query(
      'DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [daysOld]
    );
  }

  // Notification templates
  static async notifyPointsAwarded(userId, points, receiptNumber) {
    return await this.create({
      userId,
      type: 'points_awarded',
      priority: 'medium',
      subject: `${points} Points Awarded!`,
      message: `You've earned ${points} points for receipt ${receiptNumber}. Keep shopping to earn more!`
    });
  }

  static async notifyTierPromotion(userId, newTier) {
    return await this.create({
      userId,
      type: 'tier_promotion',
      priority: 'high',
      subject: `Congratulations! Promoted to ${newTier.toUpperCase()} tier`,
      message: `You've been promoted to ${newTier} tier! Enjoy enhanced benefits and higher points multipliers.`
    });
  }

  static async notifyPointsExpiring(userId, points, expirationDate) {
    return await this.create({
      userId,
      type: 'points_expiring',
      priority: 'high',
      subject: 'Your Points Are Expiring Soon!',
      message: `${points} points will expire on ${expirationDate.toLocaleDateString()}. Redeem them now!`
    });
  }

  static async notifyReceiptFlagged(userId, receiptId) {
    return await this.create({
      userId,
      type: 'receipt_flagged',
      priority: 'medium',
      subject: 'Receipt Flagged for Review',
      message: `Your receipt #${receiptId} has been flagged for manual review. This is a routine quality check.`
    });
  }

  static async notifyDailyFlags(userIds) {
    const promises = userIds.map(userId =>
      this.create({
        userId,
        type: 'daily_flags',
        priority: 'high',
        subject: 'Daily System Flags - 8:00 AM',
        message: 'Daily operational flags have been generated. Please check your dashboard for pending tasks.'
      })
    );
    
    await Promise.all(promises);
  }
}

module.exports = Notification;
