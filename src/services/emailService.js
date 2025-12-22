const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  /**
   * Send email verification
   * @param {string} email - Recipient email
   * @param {string} token - Verification token
   * @param {string} firstName - User's first name
   */
  async sendVerificationEmail(email, token, firstName) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Verify Your BangoPoints Account',
      html: `
        <h2>Welcome to BangoPoints, ${firstName}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
        <p>Or copy this link to your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <br>
        <p>Best regards,<br>BangoPoints Team</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send password reset email
   * @param {string} email - Recipient email
   * @param {string} token - Reset token
   * @param {string} firstName - User's first name
   */
  async sendPasswordResetEmail(email, token, firstName) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Reset Your BangoPoints Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${firstName},</p>
        <p>We received a request to reset your BangoPoints password. Click the link below to reset it:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>Or copy this link to your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br>BangoPoints Team</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send points awarded notification
   * @param {string} email - Recipient email
   * @param {string} firstName - User's first name
   * @param {number} points - Points awarded
   * @param {string} receiptNumber - Receipt number
   */
  async sendPointsAwardedEmail(email, firstName, points, receiptNumber) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `${points} Points Awarded!`,
      html: `
        <h2>Congratulations ${firstName}!</h2>
        <p>You've earned <strong>${points} points</strong> for your recent purchase.</p>
        <p>Receipt: ${receiptNumber}</p>
        <p>Login to your BangoPoints account to view your balance and redeem rewards.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Dashboard
        </a>
        <br><br>
        <p>Keep shopping to earn more points!</p>
        <p>Best regards,<br>BangoPoints Team</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Points awarded email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send points awarded email to ${email}:`, error);
    }
  }

  /**
   * Send points expiration warning
   * @param {string} email - Recipient email
   * @param {string} firstName - User's first name
   * @param {number} expiringPoints - Points expiring
   * @param {Date} expirationDate - Expiration date
   */
  async sendPointsExpirationWarning(email, firstName, expiringPoints, expirationDate) {
    const dateStr = expirationDate.toLocaleDateString('en-KE');

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: '⚠️ Your BangoPoints Are Expiring Soon!',
      html: `
        <h2>Action Required, ${firstName}!</h2>
        <p><strong>${expiringPoints} points</strong> will expire on <strong>${dateStr}</strong>.</p>
        <p>Don't let your points go to waste! Redeem them now for:</p>
        <ul>
          <li>Airtime vouchers</li>
          <li>Shopping vouchers</li>
          <li>Data bundles</li>
        </ul>
        <a href="${process.env.CLIENT_URL}/rewards" style="padding: 10px 20px; background: #ffc107; color: black; text-decoration: none; border-radius: 5px; display: inline-block;">
          Redeem Now
        </a>
        <br><br>
        <p>Best regards,<br>BangoPoints Team</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Points expiration warning sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send expiration warning to ${email}:`, error);
    }
  }

  /**
   * Send tier promotion notification
   * @param {string} email - Recipient email
   * @param {string} firstName - User's first name
   * @param {string} newTier - New loyalty tier
   * @param {number} multiplier - New multiplier
   */
  async sendTierPromotionEmail(email, firstName, newTier, multiplier) {
    const tierEmoji = newTier === 'gold' ? '🥇' : newTier === 'silver' ? '🥈' : '🥉';

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `🎉 Congratulations! You've Been Promoted to ${newTier.toUpperCase()} Tier!`,
      html: `
        <h2>Amazing News, ${firstName}! ${tierEmoji}</h2>
        <p>You've been promoted to the <strong>${newTier.toUpperCase()}</strong> loyalty tier!</p>
        <p>Your new benefits:</p>
        <ul>
          <li><strong>${multiplier}x</strong> points multiplier on all purchases</li>
          <li>Exclusive rewards and offers</li>
          <li>Priority customer support</li>
        </ul>
        <p>Keep earning to reach even higher tiers!</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Your Status
        </a>
        <br><br>
        <p>Best regards,<br>BangoPoints Team</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Tier promotion email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send tier promotion email to ${email}:`, error);
    }
  }

  /**
   * Send daily report to management
   * @param {Array} recipients - Array of email addresses
   * @param {Object} reportData - Report data
   */
  async sendDailyReport(recipients, reportData) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: recipients.join(','),
      subject: `BangoPoints Daily Report - ${new Date().toLocaleDateString()}`,
      html: `
        <h2>Daily Operations Report</h2>
        <h3>Receipts Processed</h3>
        <ul>
          <li>Total Receipts: ${reportData.totalReceipts}</li>
          <li>Approved: ${reportData.approvedReceipts}</li>
          <li>Pending: ${reportData.pendingReceipts}</li>
          <li>Flagged: ${reportData.flaggedReceipts}</li>
        </ul>
        <h3>Points Summary</h3>
        <ul>
          <li>Points Awarded Today: ${reportData.pointsAwarded}</li>
          <li>Active Shoppers: ${reportData.activeShoppers}</li>
        </ul>
        <h3>System Health</h3>
        <ul>
          <li>Status: ${reportData.systemStatus}</li>
          <li>Uptime: ${reportData.uptime}</li>
        </ul>
        <br>
        <p>Detailed report available in the admin dashboard.</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info('Daily report email sent');
    } catch (error) {
      logger.error('Failed to send daily report email:', error);
    }
  }
}

module.exports = new EmailService();
