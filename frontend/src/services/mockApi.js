// Mock API Service - Intercepts all API calls and returns mock data
// This enables the app to run completely standalone without a backend

import mockData from './mockData';

// Configuration
const MOCK_DELAY = 300; // Simulate network delay (ms)
const ENABLE_MOCK = true; // Set to true to enable mock mode

// Helper to simulate async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create success response
const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

// Helper to create error response
const errorResponse = (message = 'Error', code = 400) => ({
  success: false,
  message,
  code
});

// Mock API handlers
const mockHandlers = {
  // Auth endpoints
  'POST /auth/login': async (data) => {
    await delay(MOCK_DELAY);
    const { email } = data;
    
    // Find user by email
    const user = Object.values(mockData.users).find(u => u.email === email);
    
    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }
    
    return successResponse({
      user,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    }, 'Login successful');
  },

  'POST /auth/register': async (data) => {
    await delay(MOCK_DELAY);
    const newUser = {
      id: Date.now(),
      ...data,
      role: 'shopper',
      points: 0,
      tier: 'bronze',
      createdAt: new Date().toISOString()
    };
    return successResponse({
      user: newUser,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    }, 'Registration successful');
  },

  'POST /auth/refresh-token': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      token: 'mock-refreshed-token-' + Date.now()
    });
  },

  // Shopper endpoints
  'GET /shoppers/profile': async () => {
    await delay(MOCK_DELAY);
    return successResponse(mockData.users.shopper);
  },

  'GET /shoppers/points': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      totalPoints: mockData.users.shopper.points,
      tier: mockData.users.shopper.tier
    });
  },

  'GET /shoppers/tier-info': async () => {
    await delay(MOCK_DELAY);
    const tierInfo = {
      bronze: { name: 'Bronze', multiplier: 1, minPoints: 0, maxPoints: 9999 },
      silver: { name: 'Silver', multiplier: 1.5, minPoints: 10000, maxPoints: 49999 },
      gold: { name: 'Gold', multiplier: 2, minPoints: 50000, maxPoints: 999999 }
    };
    const currentTier = mockData.users.shopper.tier || 'bronze';
    const pointsToNext = tierInfo.silver.minPoints - mockData.users.shopper.points;
    return successResponse({
      currentTier: tierInfo[currentTier],
      nextTier: currentTier === 'bronze' ? tierInfo.silver : (currentTier === 'silver' ? tierInfo.gold : null),
      pointsToNext: pointsToNext > 0 ? pointsToNext : 0,
      allTiers: tierInfo
    });
  },

  'GET /shoppers/receipts': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      receipts: mockData.receipts,
      total: mockData.receipts.length
    });
  },

  'POST /shoppers/receipts': async (data) => {
    await delay(MOCK_DELAY);
    const newReceipt = {
      id: Date.now(),
      shopperId: mockData.users.shopper.id,
      ...data,
      status: 'pending',
      pointsEarned: 0,
      submittedAt: new Date().toISOString()
    };
    mockData.receipts.unshift(newReceipt);
    return successResponse(newReceipt, 'Receipt submitted successfully');
  },

  'GET /shoppers/rewards': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      rewards: mockData.rewards,
      total: mockData.rewards.length
    });
  },

  'POST /shoppers/rewards/redeem': async (data) => {
    await delay(MOCK_DELAY);
    const reward = mockData.rewards.find(r => r.id === data.rewardId);
    if (!reward) {
      return errorResponse('Reward not found', 404);
    }
    
    const newRedemption = {
      id: Date.now(),
      shopperId: mockData.users.shopper.id,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsUsed: reward.pointsCost,
      status: 'completed',
      redeemedAt: new Date().toISOString(),
      code: 'CODE-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
    mockData.redemptions.unshift(newRedemption);
    return successResponse(newRedemption, 'Reward redeemed successfully');
  },

  'GET /shoppers/redemptions': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      redemptions: mockData.redemptions,
      total: mockData.redemptions.length
    });
  },

  // Admin endpoints
  'GET /admin/users': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      users: Object.values(mockData.users),
      total: Object.values(mockData.users).length
    });
  },

  'GET /admin/brands': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      brands: mockData.brands,
      total: mockData.brands.length
    });
  },

  'POST /admin/brands': async (data) => {
    await delay(MOCK_DELAY);
    const newBrand = {
      id: Date.now(),
      ...data,
      active: true
    };
    mockData.brands.push(newBrand);
    return successResponse(newBrand, 'Brand created successfully');
  },

  'PUT /admin/brands/:id': async (data, params) => {
    await delay(MOCK_DELAY);
    const index = mockData.brands.findIndex(b => b.id === parseInt(params.id));
    if (index === -1) {
      return errorResponse('Brand not found', 404);
    }
    mockData.brands[index] = { ...mockData.brands[index], ...data };
    return successResponse(mockData.brands[index], 'Brand updated successfully');
  },

  'GET /admin/stores': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      stores: mockData.stores,
      total: mockData.stores.length
    });
  },

  'POST /admin/stores': async (data) => {
    await delay(MOCK_DELAY);
    const newStore = {
      id: Date.now(),
      ...data,
      active: true
    };
    mockData.stores.push(newStore);
    return successResponse(newStore, 'Store created successfully');
  },

  'GET /admin/receipts': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      receipts: mockData.receipts,
      total: mockData.receipts.length
    });
  },

  'PUT /admin/receipts/:id': async (data, params) => {
    await delay(MOCK_DELAY);
    const index = mockData.receipts.findIndex(r => r.id === parseInt(params.id));
    if (index === -1) {
      return errorResponse('Receipt not found', 404);
    }
    mockData.receipts[index] = { ...mockData.receipts[index], ...data };
    return successResponse(mockData.receipts[index], 'Receipt updated successfully');
  },

  'GET /admin/rewards': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      rewards: mockData.rewards,
      total: mockData.rewards.length
    });
  },

  'POST /admin/rewards': async (data) => {
    await delay(MOCK_DELAY);
    const newReward = {
      id: Date.now(),
      ...data,
      available: true
    };
    mockData.rewards.push(newReward);
    return successResponse(newReward, 'Reward created successfully');
  },

  'GET /admin/analytics': async () => {
    await delay(MOCK_DELAY);
    return successResponse(mockData.analytics);
  },

  // Brand Manager endpoints
  'GET /brand-manager/dashboard': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      campaigns: mockData.campaigns,
      analytics: {
        totalCampaigns: mockData.campaigns.length,
        activeCampaigns: mockData.campaigns.filter(c => c.status === 'active').length,
        totalBudget: mockData.campaigns.reduce((sum, c) => sum + c.budget, 0),
        totalSpent: mockData.campaigns.reduce((sum, c) => sum + c.spent, 0),
        totalImpressions: mockData.campaigns.reduce((sum, c) => sum + c.impressions, 0),
        totalConversions: mockData.campaigns.reduce((sum, c) => sum + c.conversions, 0)
      }
    });
  },

  'GET /brand-manager/campaigns': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      campaigns: mockData.campaigns,
      total: mockData.campaigns.length
    });
  },

  'POST /brand-manager/campaigns': async (data) => {
    await delay(MOCK_DELAY);
    const newCampaign = {
      id: Date.now(),
      ...data,
      spent: 0,
      impressions: 0,
      conversions: 0,
      status: 'active'
    };
    mockData.campaigns.push(newCampaign);
    return successResponse(newCampaign, 'Campaign created successfully');
  },

  'GET /brand-manager/brands': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      brands: mockData.brands,
      total: mockData.brands.length
    });
  },

  // PPG endpoints
  'GET /ppg/dashboard': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      clockRecords: mockData.clockRecords,
      activeRecord: mockData.clockRecords.find(r => r.status === 'active'),
      stats: {
        totalHours: mockData.clockRecords.reduce((sum, r) => sum + (r.hoursWorked || 0), 0),
        shiftsCompleted: mockData.clockRecords.filter(r => r.status === 'completed').length
      }
    });
  },

  'POST /ppg/clock-in': async (data) => {
    await delay(MOCK_DELAY);
    const newRecord = {
      id: Date.now(),
      ppgId: mockData.users.ppg.id,
      ...data,
      clockIn: new Date().toISOString(),
      clockOut: null,
      hoursWorked: null,
      status: 'active'
    };
    mockData.clockRecords.unshift(newRecord);
    return successResponse(newRecord, 'Clocked in successfully');
  },

  'POST /ppg/clock-out': async (data) => {
    await delay(MOCK_DELAY);
    const record = mockData.clockRecords.find(r => r.id === data.recordId);
    if (!record) {
      return errorResponse('Record not found', 404);
    }
    const clockOut = new Date();
    const clockIn = new Date(record.clockIn);
    const hoursWorked = Math.round((clockOut - clockIn) / (1000 * 60 * 60) * 10) / 10;
    
    record.clockOut = clockOut.toISOString();
    record.hoursWorked = hoursWorked;
    record.status = 'completed';
    
    return successResponse(record, 'Clocked out successfully');
  },

  // BEO endpoints
  'GET /beo/dashboard': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      receipts: mockData.receipts.filter(r => r.status === 'pending'),
      stats: {
        pendingReceipts: mockData.receipts.filter(r => r.status === 'pending').length,
        approvedToday: mockData.receipts.filter(r => r.status === 'approved').length,
        totalProcessed: mockData.receipts.filter(r => r.status !== 'pending').length
      }
    });
  },

  'GET /beo/receipts': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      receipts: mockData.receipts,
      total: mockData.receipts.length
    });
  },

  'PUT /beo/receipts/:id/approve': async (data, params) => {
    await delay(MOCK_DELAY);
    const receipt = mockData.receipts.find(r => r.id === parseInt(params.id));
    if (!receipt) {
      return errorResponse('Receipt not found', 404);
    }
    receipt.status = 'approved';
    receipt.processedAt = new Date().toISOString();
    receipt.pointsEarned = data.pointsEarned || 0;
    return successResponse(receipt, 'Receipt approved successfully');
  },

  // Notifications
  'GET /notifications': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      notifications: mockData.notifications,
      unreadCount: mockData.notifications.filter(n => !n.read).length
    });
  },

  'PUT /notifications/:id/read': async (data, params) => {
    await delay(MOCK_DELAY);
    const notification = mockData.notifications.find(n => n.id === parseInt(params.id));
    if (notification) {
      notification.read = true;
    }
    return successResponse(notification);
  },

  // Brands (public)
  'GET /brands': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      brands: mockData.brands.filter(b => b.active),
      total: mockData.brands.filter(b => b.active).length
    });
  },

  // Stores (public)
  'GET /stores': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      stores: mockData.stores.filter(s => s.active),
      total: mockData.stores.filter(s => s.active).length
    });
  },

  // Tickets
  'GET /tickets': async () => {
    await delay(MOCK_DELAY);
    return successResponse({
      tickets: mockData.tickets,
      total: mockData.tickets.length
    });
  },

  'POST /tickets': async (data) => {
    await delay(MOCK_DELAY);
    const newTicket = {
      id: Date.now(),
      userId: mockData.users.shopper.id,
      userName: `${mockData.users.shopper.firstName} ${mockData.users.shopper.lastName}`,
      ...data,
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockData.tickets.unshift(newTicket);
    return successResponse(newTicket, 'Ticket created successfully');
  },
};

// Main mock API interceptor
export const mockApiInterceptor = async (method, url, data = null) => {
  if (!ENABLE_MOCK) {
    return null; // Fall through to real API
  }

  // Extract path parameters
  const urlParts = url.split('?')[0].split('/');
  let handlerKey = `${method} ${url.split('?')[0]}`;
  let params = {};

  // Try to find exact match first
  let handler = mockHandlers[handlerKey];

  // If not found, try to match with parameters
  if (!handler) {
    for (const key in mockHandlers) {
      const keyParts = key.split(' ')[1].split('/');
      if (keyParts.length === urlParts.length) {
        let match = true;
        const tempParams = {};
        
        for (let i = 0; i < keyParts.length; i++) {
          if (keyParts[i].startsWith(':')) {
            tempParams[keyParts[i].substring(1)] = urlParts[i];
          } else if (keyParts[i] !== urlParts[i]) {
            match = false;
            break;
          }
        }
        
        if (match && key.startsWith(method + ' ')) {
          handler = mockHandlers[key];
          params = tempParams;
          break;
        }
      }
    }
  }

  if (handler) {
    console.log(`[Mock API] ${method} ${url}`, data);
    try {
      const response = await handler(data, params);
      console.log(`[Mock API] Response:`, response);
      return response;
    } catch (error) {
      console.error(`[Mock API] Error:`, error);
      return errorResponse('Mock API error: ' + error.message, 500);
    }
  }

  console.warn(`[Mock API] No handler for ${method} ${url}`);
  return successResponse([], `No mock handler for ${method} ${url}`);
};

export const isMockMode = () => ENABLE_MOCK;

export default mockApiInterceptor;
