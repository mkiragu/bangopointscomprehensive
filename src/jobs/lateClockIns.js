const cron = require('node-cron');
const logger = require('../utils/logger');
const ClockRecord = require('../models/ClockRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { roles } = require('../config/constants');

// Check for late clock-ins at 8:30 AM
const lateClockIns = cron.schedule('30 8 * * *', async () => {
  try {
    logger.info('Checking for late clock-ins');

    const today = new Date().toISOString().split('T')[0];
    
    // Get all PPG users
    const { users: ppgUsers } = await User.findAll({ role: roles.PPG, isActive: true }, 1, 1000);

    let lateCount = 0;
    let missingCount = 0;

    for (const ppg of ppgUsers) {
      const record = await ClockRecord.getTodayRecord(ppg.id);

      if (!record) {
        // PPG hasn't clocked in yet
        missingCount++;
        
        // Notify PPG Supervisors and SysAdmin
        const { users: supervisors } = await User.findAll({ 
          role: roles.PPG_SUPERVISOR, 
          isActive: true 
        }, 1, 100);

        const { users: admins } = await User.findAll({ 
          role: roles.ADMIN, 
          isActive: true 
        }, 1, 100);

        const notificationRecipients = [...supervisors, ...admins];

        for (const recipient of notificationRecipients) {
          await Notification.create({
            userId: recipient.id,
            type: 'late_clock_in',
            priority: 'high',
            subject: `PPG ${ppg.first_name} ${ppg.last_name} - Missing Clock-In`,
            message: `PPG ${ppg.first_name} ${ppg.last_name} has not clocked in yet today (${today}).`
          });
        }
      } else if (record.is_late) {
        lateCount++;
        
        // Send tardiness notification
        await Notification.create({
          userId: ppg.id,
          type: 'tardiness_alert',
          priority: 'medium',
          subject: 'Late Clock-In Recorded',
          message: `You clocked in late today. Please try to arrive by 8:00 AM.`
        });
      }
    }

    logger.info(`Late clock-ins: ${lateCount}, Missing clock-ins: ${missingCount}`);
  } catch (error) {
    logger.error('Error in late clock-ins check:', error);
  }
}, {
  scheduled: process.env.ENABLE_CRON === 'true',
  timezone: process.env.TIMEZONE || 'Africa/Nairobi'
});

module.exports = {
  lateClockIns
};
