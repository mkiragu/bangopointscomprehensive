const cron = require('node-cron');
const logger = require('../utils/logger');
const Notification = require('../models/Notification');
const Shopper = require('../models/Shopper');
const Helpers = require('../utils/helpers');
const emailService = require('../services/emailService');

// Points expiration warnings (run daily, check if we're in warning period)
const pointsExpiration = cron.schedule('0 9 * * *', async () => {
  try {
    // Check if we should send warnings (2 months before expiration)
    if (!Helpers.shouldSendExpirationWarning()) {
      logger.info('Not in expiration warning period, skipping...');
      return;
    }

    logger.info('Running points expiration warning job');

    // Process shoppers in batches to avoid memory issues
    const batchSize = 100;
    let page = 1;
    let hasMore = true;
    let warningsSent = 0;

    while (hasMore) {
      const { shoppers, total } = await Shopper.findAll(page, batchSize);

      // For each shopper with points, send warning
      for (const shopper of shoppers) {
        if (shopper.points_balance > 0) {
          // In production, calculate exact expiring points per brand (non-rollover only)
          const expiringPoints = shopper.points_balance; // Simplified
          const expirationDate = Helpers.getPointsExpirationDate();

          // Send notification
          await Notification.notifyPointsExpiring(
            shopper.user_id,
            expiringPoints,
            expirationDate
          );

          // Send email
          try {
            await emailService.sendPointsExpirationWarning(
              shopper.email,
              shopper.first_name,
              expiringPoints,
              expirationDate
            );
          } catch (emailError) {
            logger.error(`Failed to send expiration email to ${shopper.email}:`, emailError);
          }

          warningsSent++;
        }
      }

      // Check if there are more pages
      hasMore = (page * batchSize) < total;
      page++;
    }

    logger.info(`Sent ${warningsSent} expiration warnings`);
  } catch (error) {
    logger.error('Error in points expiration job:', error);
  }
}, {
  scheduled: process.env.ENABLE_CRON === 'true',
  timezone: process.env.TIMEZONE || 'Africa/Nairobi'
});

module.exports = {
  pointsExpiration
};
