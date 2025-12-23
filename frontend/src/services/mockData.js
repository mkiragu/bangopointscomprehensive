// Mock data generator for demo purposes
// This file contains all mock data for a fully functional frontend-only demo

// Helper function to generate random dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to generate IDs
let idCounter = 1000;
const generateId = () => idCounter++;

// Mock Users Data
export const mockUsers = {
  admin: {
    id: 1,
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+254712345678',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: null
  },
  brandManager: {
    id: 2,
    email: 'manager@test.com',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'brand_manager',
    phone: '+254723456789',
    brandId: 1,
    createdAt: '2024-01-15T00:00:00Z',
    avatar: null
  },
  shopper: {
    id: 3,
    email: 'shopper@test.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'shopper',
    phone: '+254734567890',
    points: 2450,
    tier: 'gold',
    totalSpent: 45000,
    receiptsSubmitted: 28,
    createdAt: '2024-02-01T00:00:00Z',
    avatar: null
  },
  ppg: {
    id: 4,
    email: 'ppg@test.com',
    firstName: 'Mary',
    lastName: 'Promoter',
    role: 'ppg',
    phone: '+254745678901',
    storeId: 1,
    createdAt: '2024-02-15T00:00:00Z',
    avatar: null
  },
  beo: {
    id: 5,
    email: 'beo@test.com',
    firstName: 'James',
    lastName: 'Engager',
    role: 'beo',
    phone: '+254756789012',
    brandId: 2,
    createdAt: '2024-03-01T00:00:00Z',
    avatar: null
  },
  executive: {
    id: 6,
    email: 'ceo@test.com',
    firstName: 'Executive',
    lastName: 'Director',
    role: 'executive',
    phone: '+254767890123',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: null
  }
};

// Mock Brands
export const mockBrands = [
  { id: 1, name: 'Coca-Cola', logo: null, category: 'Beverages', pointsPerKES: 2, active: true },
  { id: 2, name: 'Safaricom', logo: null, category: 'Telecommunications', pointsPerKES: 1.5, active: true },
  { id: 3, name: 'Brookside', logo: null, category: 'Dairy', pointsPerKES: 2.5, active: true },
  { id: 4, name: 'Tusker', logo: null, category: 'Beverages', pointsPerKES: 1.8, active: true },
  { id: 5, name: 'Omo', logo: null, category: 'Household', pointsPerKES: 2, active: true },
  { id: 6, name: 'Colgate', logo: null, category: 'Personal Care', pointsPerKES: 3, active: true },
  { id: 7, name: 'Nivea', logo: null, category: 'Personal Care', pointsPerKES: 2.5, active: true },
  { id: 8, name: 'Knorr', logo: null, category: 'Food', pointsPerKES: 2.2, active: true },
];

// Mock Stores
export const mockStores = [
  { id: 1, name: 'Carrefour Westgate', location: 'Westlands, Nairobi', address: 'Westgate Mall', active: true },
  { id: 2, name: 'Naivas Kilimani', location: 'Kilimani, Nairobi', address: 'Yaya Centre', active: true },
  { id: 3, name: 'Quickmart Eastleigh', location: 'Eastleigh, Nairobi', address: 'Eastleigh Section 1', active: true },
  { id: 4, name: 'Carrefour Sarit', location: 'Westlands, Nairobi', address: 'Sarit Centre', active: true },
  { id: 5, name: 'Naivas Junction', location: 'Dagoretti, Nairobi', address: 'Junction Mall', active: true },
];

// Mock Receipts
export const mockReceipts = [
  {
    id: 1,
    shopperId: 3,
    storeId: 1,
    storeName: 'Carrefour Westgate',
    totalAmount: 3500,
    pointsEarned: 350,
    status: 'approved',
    imageUrl: '/uploads/receipts/receipt1.jpg',
    submittedAt: '2024-12-20T10:30:00Z',
    processedAt: '2024-12-20T14:00:00Z',
    items: [
      { brandId: 1, brandName: 'Coca-Cola', amount: 500, points: 50 },
      { brandId: 3, brandName: 'Brookside', amount: 800, points: 80 },
      { brandId: 5, brandName: 'Omo', amount: 1200, points: 120 },
    ]
  },
  {
    id: 2,
    shopperId: 3,
    storeId: 2,
    storeName: 'Naivas Kilimani',
    totalAmount: 2200,
    pointsEarned: 220,
    status: 'approved',
    imageUrl: '/uploads/receipts/receipt2.jpg',
    submittedAt: '2024-12-19T15:20:00Z',
    processedAt: '2024-12-19T18:30:00Z',
    items: [
      { brandId: 2, brandName: 'Safaricom', amount: 1000, points: 100 },
      { brandId: 6, brandName: 'Colgate', amount: 1200, points: 120 },
    ]
  },
  {
    id: 3,
    shopperId: 3,
    storeId: 1,
    storeName: 'Carrefour Westgate',
    totalAmount: 1800,
    pointsEarned: 0,
    status: 'pending',
    imageUrl: '/uploads/receipts/receipt3.jpg',
    submittedAt: '2024-12-22T09:15:00Z',
    processedAt: null,
    items: []
  },
];

// Mock Rewards
export const mockRewards = [
  { id: 1, name: 'Safaricom 100 KES Airtime', description: 'Get 100 KES airtime instantly', pointsCost: 150, category: 'airtime', available: true, imageUrl: null },
  { id: 2, name: 'Safaricom 500 KES Airtime', description: 'Get 500 KES airtime instantly', pointsCost: 700, category: 'airtime', available: true, imageUrl: null },
  { id: 3, name: '1GB Data Bundle', description: 'Safaricom 1GB data valid for 7 days', pointsCost: 300, category: 'data', available: true, imageUrl: null },
  { id: 4, name: '5GB Data Bundle', description: 'Safaricom 5GB data valid for 30 days', pointsCost: 1200, category: 'data', available: true, imageUrl: null },
  { id: 5, name: '500 KES Carrefour Voucher', description: 'Shopping voucher for Carrefour stores', pointsCost: 600, category: 'voucher', available: true, imageUrl: null },
  { id: 6, name: '1000 KES Naivas Voucher', description: 'Shopping voucher for Naivas stores', pointsCost: 1100, category: 'voucher', available: true, imageUrl: null },
];

// Mock Redemptions
export const mockRedemptions = [
  {
    id: 1,
    shopperId: 3,
    rewardId: 1,
    rewardName: 'Safaricom 100 KES Airtime',
    pointsUsed: 150,
    status: 'completed',
    redeemedAt: '2024-12-18T12:00:00Z',
    code: 'AIRTIME-ABC123'
  },
  {
    id: 2,
    shopperId: 3,
    rewardId: 3,
    rewardName: '1GB Data Bundle',
    pointsUsed: 300,
    status: 'completed',
    redeemedAt: '2024-12-15T09:30:00Z',
    code: 'DATA-XYZ789'
  },
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 1,
    userId: 3,
    title: 'Receipt Approved',
    message: 'Your receipt from Carrefour Westgate has been approved. You earned 350 points!',
    type: 'success',
    read: false,
    createdAt: '2024-12-20T14:00:00Z'
  },
  {
    id: 2,
    userId: 3,
    title: 'New Reward Available',
    message: 'Check out the new 5GB Data Bundle reward in the rewards catalog!',
    type: 'info',
    read: false,
    createdAt: '2024-12-21T10:00:00Z'
  },
  {
    id: 3,
    userId: 3,
    title: 'Reward Redeemed',
    message: 'You successfully redeemed Safaricom 100 KES Airtime. Code: AIRTIME-ABC123',
    type: 'success',
    read: true,
    createdAt: '2024-12-18T12:05:00Z'
  },
];

// Mock Analytics Data
export const mockAnalytics = {
  overview: {
    totalUsers: 15432,
    activeUsers: 8921,
    totalPoints: 2456789,
    totalReceipts: 45678,
    totalRedemptions: 12345,
    revenue: 15678900
  },
  recentActivity: [
    { date: '2024-12-23', users: 234, receipts: 567, points: 12345 },
    { date: '2024-12-22', users: 456, receipts: 892, points: 23456 },
    { date: '2024-12-21', users: 389, receipts: 678, points: 18900 },
    { date: '2024-12-20', users: 412, receipts: 734, points: 20123 },
    { date: '2024-12-19', users: 378, receipts: 645, points: 17234 },
    { date: '2024-12-18', users: 445, receipts: 789, points: 21456 },
    { date: '2024-12-17', users: 398, receipts: 701, points: 19234 },
  ],
  topBrands: [
    { brand: 'Coca-Cola', receipts: 1234, points: 45678, revenue: 234567 },
    { brand: 'Safaricom', receipts: 987, points: 34567, revenue: 198765 },
    { brand: 'Brookside', receipts: 876, points: 29876, revenue: 176543 },
    { brand: 'Tusker', receipts: 765, points: 23456, revenue: 154321 },
  ],
  topShoppers: [
    { name: 'John Doe', points: 12345, receipts: 89, tier: 'gold' },
    { name: 'Jane Smith', points: 10234, receipts: 76, tier: 'gold' },
    { name: 'Mike Johnson', points: 8567, receipts: 65, tier: 'silver' },
    { name: 'Sarah Williams', points: 7234, receipts: 54, tier: 'silver' },
  ]
};

// Mock Clock Records (for PPG)
export const mockClockRecords = [
  {
    id: 1,
    ppgId: 4,
    storeId: 1,
    storeName: 'Carrefour Westgate',
    clockIn: '2024-12-23T08:00:00Z',
    clockOut: '2024-12-23T17:00:00Z',
    hoursWorked: 9,
    status: 'completed'
  },
  {
    id: 2,
    ppgId: 4,
    storeId: 1,
    storeName: 'Carrefour Westgate',
    clockIn: '2024-12-22T08:00:00Z',
    clockOut: '2024-12-22T17:00:00Z',
    hoursWorked: 9,
    status: 'completed'
  },
  {
    id: 3,
    ppgId: 4,
    storeId: 1,
    storeName: 'Carrefour Westgate',
    clockIn: '2024-12-23T08:00:00Z',
    clockOut: null,
    hoursWorked: null,
    status: 'active'
  },
];

// Mock Campaigns (for Brand Manager)
export const mockCampaigns = [
  {
    id: 1,
    brandId: 1,
    brandName: 'Coca-Cola',
    name: 'Holiday Special 2024',
    description: 'Double points on all Coca-Cola products',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'active',
    budget: 50000,
    spent: 32000,
    impressions: 45678,
    conversions: 2345
  },
  {
    id: 2,
    brandId: 2,
    brandName: 'Safaricom',
    name: 'New Year Data Bonus',
    description: 'Extra points on airtime purchases',
    startDate: '2024-12-15',
    endDate: '2025-01-15',
    status: 'active',
    budget: 75000,
    spent: 21000,
    impressions: 32456,
    conversions: 1876
  },
];

// Mock Tickets/Support
export const mockTickets = [
  {
    id: 1,
    userId: 3,
    userName: 'John Doe',
    subject: 'Receipt not processed',
    description: 'My receipt from yesterday has not been processed yet',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-12-22T10:00:00Z',
    updatedAt: '2024-12-22T10:00:00Z'
  },
  {
    id: 2,
    userId: 3,
    userName: 'John Doe',
    subject: 'Reward code not working',
    description: 'The airtime code I received is not working',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-12-20T14:30:00Z',
    updatedAt: '2024-12-21T09:00:00Z',
    resolution: 'Code resent to customer'
  },
];

// Export all mock data
export const mockData = {
  users: mockUsers,
  brands: mockBrands,
  stores: mockStores,
  receipts: mockReceipts,
  rewards: mockRewards,
  redemptions: mockRedemptions,
  notifications: mockNotifications,
  analytics: mockAnalytics,
  clockRecords: mockClockRecords,
  campaigns: mockCampaigns,
  tickets: mockTickets
};

export default mockData;
