const logger = require('../utils/logger');
const { dailyFlags } = require('./dailyFlags');
const { pointsExpiration } = require('./pointsExpiration');
const { lateClockIns } = require('./lateClockIns');

class JobScheduler {
  static init() {
    if (process.env.ENABLE_CRON !== 'true') {
      logger.info('Cron jobs are disabled');
      return;
    }

    logger.info('Initializing scheduled jobs...');

    // Start all cron jobs
    dailyFlags.start();
    pointsExpiration.start();
    lateClockIns.start();

    logger.info('All scheduled jobs initialized successfully');
    logger.info('- Daily flags: 8:00 AM daily');
    logger.info('- Points expiration warnings: 9:00 AM daily');
    logger.info('- Late clock-in checks: 8:30 AM daily');
  }

  static stop() {
    logger.info('Stopping all scheduled jobs...');
    
    dailyFlags.stop();
    pointsExpiration.stop();
    lateClockIns.stop();

    logger.info('All scheduled jobs stopped');
  }
}

module.exports = JobScheduler;
