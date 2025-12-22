const cron = require('node-cron');
const logger = require('../utils/logger');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { roles } = require('../config/constants');

// Daily flags at 8:00 AM EAT (Africa/Nairobi)
const dailyFlags = cron.schedule('0 8 * * *', async () => {
  try {
    logger.info('Running daily flags job at 8:00 AM');

    // Get all relevant users (PPG, BEO, BEO Supervisor, Area Manager, Supervisor)
    const relevantRoles = [
      roles.PPG,
      roles.BEO,
      roles.BEO_SUPERVISOR,
      roles.PPG_SUPERVISOR,
      roles.AREA_MANAGER
    ];

    const usersByRole = await Promise.all(
      relevantRoles.map(role => 
        User.findAll({ role, isActive: true }, 1, 1000)
      )
    );

    const userIds = usersByRole
      .flatMap(result => result.users)
      .map(user => user.id);

    // Send notifications to all relevant users
    await Notification.notifyDailyFlags(userIds);

    logger.info(`Daily flags sent to ${userIds.length} users`);
  } catch (error) {
    logger.error('Error in daily flags job:', error);
  }
}, {
  scheduled: process.env.ENABLE_CRON === 'true',
  timezone: process.env.TIMEZONE || 'Africa/Nairobi'
});

module.exports = {
  dailyFlags
};
