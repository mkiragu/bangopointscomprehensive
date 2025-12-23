const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const shopperRoutes = require('./routes/shoppers');
const receiptRoutes = require('./routes/receipts');
const brandRoutes = require('./routes/brands');
const storeRoutes = require('./routes/stores');
const ppgRoutes = require('./routes/ppg');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const rewardRoutes = require('./routes/rewards');
const ticketRoutes = require('./routes/tickets');
const reportRoutes = require('./routes/reports');
const adRoutes = require('./routes/ads');

const app = express();

// Security middleware
// Note: unsafe-inline is needed for Vite-built assets. In production, consider using
// a nonce-based CSP with proper Vite configuration
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Needed for Vite build
      scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for Vite build
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
    },
  } : false, // Disable CSP in development
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve frontend build
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/shoppers', shopperRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ppg', ppgRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ads', adRoutes);

// Serve frontend in production (must be after API routes)
if (process.env.NODE_ENV === 'production') {
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // 404 handler for development (when frontend runs separately)
  app.use((req, res) => {
    res.status(404).json({ 
      success: false, 
      message: 'Route not found' 
    });
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
