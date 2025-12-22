module.exports = {
  // User roles
  roles: {
    SHOPPER: 'shopper',
    SHOP: 'shop',
    PPG: 'ppg',
    PPG_SUPERVISOR: 'ppg_supervisor',
    BEO: 'beo',
    BEO_SUPERVISOR: 'beo_supervisor',
    AREA_MANAGER: 'area_manager',
    BRAND_MANAGER: 'brand_manager',
    EXECUTIVE: 'executive',
    ADMIN: 'admin'
  },

  // Loyalty tiers
  loyaltyTiers: {
    BRONZE: { name: 'bronze', multiplier: 1.00, minPoints: 0 },
    SILVER: { name: 'silver', multiplier: 1.25, minPoints: 10000 },
    GOLD: { name: 'gold', multiplier: 1.50, minPoints: 50000 }
  },

  // Receipt statuses
  receiptStatus: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    FLAGGED: 'flagged'
  },

  // Notification priorities
  notificationPriorities: {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  },

  // Ticket statuses
  ticketStatus: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
  },

  // Ticket priorities
  ticketPriorities: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },

  // Advertisement types
  adTypes: {
    REWARDS_UNIVERSE: 'rewards_universe',
    CONTRACTED: 'contracted',
    ADSENSE: 'adsense'
  },

  // Reward types
  rewardTypes: {
    AIRTIME: 'airtime',
    VOUCHER: 'voucher',
    DATA: 'data'
  },

  // Redemption statuses
  redemptionStatus: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed'
  },

  // Capture methods
  captureMethods: {
    PHONE: 'phone',
    EMAIL: 'email'
  },

  // Invoice statuses
  invoiceStatus: {
    DRAFT: 'draft',
    SENT: 'sent',
    PAID: 'paid'
  },

  // Kenyan supermarket chains
  supermarketChains: [
    'Carrefour',
    'Naivas',
    'Quickmart',
    'Chandarana',
    'Tuskys',
    'Cleanshelf',
    'Zucchini'
  ],

  // Product categories
  productCategories: [
    'Dairy',
    'Cooking Oils',
    'Laundry',
    'Personal Care',
    'Seasonings',
    'Confectionery',
    'Beverages',
    'Snacks'
  ],

  // Points configuration ranges
  pointsConfig: {
    MIN_POINTS_PER_KES: 8,
    MAX_POINTS_PER_KES: 15,
    MIN_PURCHASE_AMOUNT: 50,
    MAX_PURCHASE_AMOUNT: 200,
    MIN_MAX_POINTS_PER_TRANSACTION: 5000,
    MAX_MAX_POINTS_PER_TRANSACTION: 10000
  },

  // Shift configuration
  shiftConfig: {
    START_TIME: '08:00:00',
    DURATION_HOURS: 8,
    LATE_THRESHOLD_MINUTES: 15
  },

  // File upload limits
  uploadLimits: {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || 10485760), // 10MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }
};
