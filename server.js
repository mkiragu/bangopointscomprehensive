require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const JobScheduler = require('./src/jobs');
const db = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  logger.info(`BangoPoints Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  
  // Test database connection (non-blocking)
  if (db.testConnection) {
    const connected = await db.testConnection();
    if (!connected) {
      logger.warn('Server started but database connection failed. Some features may not work properly.');
    }
  }
  
  // Initialize cron jobs
  JobScheduler.init();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  JobScheduler.stop();
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

module.exports = server;
