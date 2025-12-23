import { DEMO_DATA } from './mockData';

const MOCK_MODE = true;
const API_DELAY = 300;

const mockHandlers = {
  '/auth/login': (body) => {
    const user = DEMO_DATA.users[body.role];
    if (!user) {
      return { success: false, error: 'Invalid role' };
    }
    return { success: true, user, token: 'demo-' + Date.now() };
  },
  '/shoppers/points': () => ({ success: true, data: { points: 2450, tier: 'silver', multiplier: 1.5 } }),
  '/shoppers/receipts': () => ({ success: true, data: DEMO_DATA.receipts }),
  '/shoppers/rewards': () => ({ success: true, data: DEMO_DATA.rewards }),
  '/admin/users': () => ({ success: true, data: Object.values(DEMO_DATA.users) }),
  '/admin/brands': () => ({ success: true, data: DEMO_DATA.brands }),
  '/admin/stores': () => ({ success: true, data: DEMO_DATA.stores }),
  '/brand-manager/analytics': () => ({ success: true, data: DEMO_DATA.analytics }),
  '/ppg/clock': (body) => ({ success: true, message: body.action === 'in' ? 'Clocked in' : 'Clocked out' }),
  '/beo/receipts/pending': () => ({ success: true, data: DEMO_DATA.receipts.filter((r) => r.status === 'pending') })
};

const delay = () => new Promise((resolve) => setTimeout(resolve, API_DELAY));

export const api = {
  get: async (url) => {
    if (MOCK_MODE) {
      await delay();
      const handler = mockHandlers[url];
      return handler ? handler() : { success: false, error: 'Not found' };
    }
    const res = await fetch('/api' + url);
    return res.json();
  },

  post: async (url, body) => {
    if (MOCK_MODE) {
      await delay();
      const handler = mockHandlers[url];
      return handler ? handler(body) : { success: false, error: 'Not found' };
    }
    const res = await fetch('/api' + url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  }
};
