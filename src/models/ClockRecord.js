const db = require('../config/database');

class ClockRecord {
  static async clockIn(ppgId) {
    const now = new Date();
    const shiftDate = now.toISOString().split('T')[0];
    
    // Check if already clocked in today
    const [existing] = await db.query(
      'SELECT id FROM clock_records WHERE ppg_id = ? AND shift_date = ? AND clock_out_time IS NULL',
      [ppgId, shiftDate]
    );

    if (existing.length > 0) {
      throw new Error('Already clocked in for today');
    }

    // Check if late (after 8:15 AM)
    const shiftStart = new Date(shiftDate + 'T08:00:00');
    const isLate = now > new Date(shiftStart.getTime() + 15 * 60000); // 15 minutes grace

    const [result] = await db.query(
      'INSERT INTO clock_records (ppg_id, clock_in_time, shift_date, is_late) VALUES (?, ?, ?, ?)',
      [ppgId, now, shiftDate, isLate]
    );

    return {
      id: result.insertId,
      clockInTime: now,
      isLate
    };
  }

  static async clockOut(ppgId) {
    const now = new Date();
    const shiftDate = now.toISOString().split('T')[0];

    const [result] = await db.query(
      'UPDATE clock_records SET clock_out_time = ? WHERE ppg_id = ? AND shift_date = ? AND clock_out_time IS NULL',
      [now, ppgId, shiftDate]
    );

    if (result.affectedRows === 0) {
      throw new Error('No active clock-in found for today');
    }

    return {
      clockOutTime: now
    };
  }

  static async getTodayRecord(ppgId) {
    const today = new Date().toISOString().split('T')[0];
    
    const [rows] = await db.query(
      'SELECT * FROM clock_records WHERE ppg_id = ? AND shift_date = ?',
      [ppgId, today]
    );

    return rows[0];
  }

  static async getRecords(ppgId, startDate, endDate) {
    const [rows] = await db.query(
      `SELECT * FROM clock_records 
       WHERE ppg_id = ? 
       AND shift_date BETWEEN ? AND ?
       ORDER BY shift_date DESC`,
      [ppgId, startDate, endDate]
    );

    return rows;
  }

  static async getLateRecords(startDate, endDate) {
    const [rows] = await db.query(
      `SELECT cr.*, u.first_name, u.last_name, u.email
       FROM clock_records cr
       JOIN users u ON cr.ppg_id = u.id
       WHERE cr.is_late = TRUE
       AND cr.shift_date BETWEEN ? AND ?
       ORDER BY cr.shift_date DESC`,
      [startDate, endDate]
    );

    return rows;
  }

  static async getAttendanceReport(ppgId, month, year) {
    const [rows] = await db.query(
      `SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN is_late = TRUE THEN 1 ELSE 0 END) as late_days,
        SUM(CASE WHEN clock_out_time IS NULL THEN 1 ELSE 0 END) as missing_clockouts
       FROM clock_records
       WHERE ppg_id = ?
       AND MONTH(shift_date) = ?
       AND YEAR(shift_date) = ?`,
      [ppgId, month, year]
    );

    return rows[0];
  }
}

module.exports = ClockRecord;
