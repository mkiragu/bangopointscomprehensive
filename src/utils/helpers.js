const crypto = require('crypto');

class Helpers {
  // Generate random token
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate unique receipt number
  static generateReceiptNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `RCP-${timestamp}-${random}`.toUpperCase();
  }

  // Generate invoice number
  static generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `INV-${year}${month}-${random}`;
  }

  // Format currency (KES)
  static formatCurrency(amount) {
    return `KES ${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  }

  // Calculate tier based on points
  static calculateTier(totalPoints) {
    if (totalPoints >= 50000) {
      return { tier: 'gold', multiplier: 1.50 };
    } else if (totalPoints >= 10000) {
      return { tier: 'silver', multiplier: 1.25 };
    }
    return { tier: 'bronze', multiplier: 1.00 };
  }

  // Check if user is late for shift
  static isLateForShift(clockInTime, shiftStartTime = '08:00:00') {
    const clockIn = new Date(clockInTime);
    const shiftStart = new Date(clockInTime);
    const [hours, minutes] = shiftStartTime.split(':');
    shiftStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diffMinutes = (clockIn - shiftStart) / (1000 * 60);
    return diffMinutes > 15; // Late if more than 15 minutes
  }

  // Format date for Kenya timezone
  static formatDateKenyaTime(date) {
    return new Date(date).toLocaleString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Sanitize filename for upload
  static sanitizeFilename(filename) {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_');
  }

  // Pagination helper
  static paginate(page = 1, perPage = 30) {
    const limit = Math.min(parseInt(perPage), 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;
    return { limit, offset };
  }

  // Success response
  static successResponse(data, message = 'Success') {
    return {
      success: true,
      message,
      data
    };
  }

  // Error response
  static errorResponse(message, errors = null) {
    const response = {
      success: false,
      message
    };
    if (errors) {
      response.errors = errors;
    }
    return response;
  }

  // Check if receipt is duplicate
  static async checkDuplicateReceipt(db, receiptNumber, storeId, totalAmount, timeWindow = 3600000) {
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

  // Calculate PPG payment
  static calculatePPGPayment(activeItems, receiptsProcessed, target, dailyWage) {
    if (target === 0) return 0;
    return (activeItems * receiptsProcessed / target) * dailyWage;
  }

  // Get expiration date for points (October 31 of following year for non-rollover)
  static getPointsExpirationDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Points expire on October 31 of the following year
    return new Date(currentYear + 1, 9, 31, 23, 59, 59); // Month is 0-indexed
  }

  // Check if points expiration warning should be sent (2 months before)
  static shouldSendExpirationWarning() {
    const now = new Date();
    const expirationDate = this.getPointsExpirationDate();
    const twoMonthsBefore = new Date(expirationDate);
    twoMonthsBefore.setMonth(twoMonthsBefore.getMonth() - 2);
    
    return now >= twoMonthsBefore && now < expirationDate;
  }
}

module.exports = Helpers;
