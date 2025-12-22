require('dotenv').config();
const express = require('express');
const app = require('./src/app');
const logger = require('./src/utils/logger');
const JobScheduler = require('./src/jobs');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`BangoPoints Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  
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
