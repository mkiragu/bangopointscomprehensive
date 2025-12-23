// Demo dataset used across all mock endpoints and role views.
export const DEMO_DATA = {
  users: {
    admin: { id: 1, name: 'Admin User', role: 'admin', email: 'admin@bangopoints.ke' },
    brandManager: { id: 2, name: 'Sarah Manager', role: 'brand_manager', email: 'sarah@coca-cola.ke' },
    shopper: { id: 3, name: 'John Doe', role: 'shopper', points: 2450, tier: 'silver' },
    ppg: { id: 4, name: 'PPG Agent', role: 'ppg', store: 'Carrefour Westgate' },
    beo: { id: 5, name: 'BEO Officer', role: 'beo', processed: 145 },
    executive: { id: 6, name: 'Executive', role: 'executive' }
  },
  brands: [
    { id: 1, name: 'Coca-Cola', category: 'Beverages', pointRate: 2, revenue: 45000 },
    { id: 2, name: 'Safaricom', category: 'Telecom', pointRate: 3, revenue: 89000 },
    { id: 3, name: 'Brookside', category: 'Dairy', pointRate: 2, revenue: 34000 },
    { id: 4, name: 'Tusker', category: 'Beverages', pointRate: 2, revenue: 56000 },
    { id: 5, name: 'Omo', category: 'Home Care', pointRate: 1, revenue: 23000 },
    { id: 6, name: 'Colgate', category: 'Personal Care', pointRate: 1, revenue: 19000 },
    { id: 7, name: 'Nivea', category: 'Personal Care', pointRate: 1, revenue: 21000 },
    { id: 8, name: 'Knorr', category: 'Food', pointRate: 2, revenue: 31000 }
  ],
  stores: [
    { id: 1, name: 'Carrefour Westgate', location: 'Westlands, Nairobi', receipts: 450 },
    { id: 2, name: 'Naivas Kilimani', location: 'Kilimani, Nairobi', receipts: 380 },
    { id: 3, name: 'Quickmart Eastleigh', location: 'Eastleigh, Nairobi', receipts: 290 },
    { id: 4, name: 'Chandarana Kitengela', location: 'Kitengela', receipts: 210 },
    { id: 5, name: 'Tuskys Thika', location: 'Thika', receipts: 185 }
  ],
  rewards: [
    { id: 1, name: 'Safaricom 100 KES Airtime', points: 100, type: 'airtime', stock: 1000 },
    { id: 2, name: 'Safaricom 500 KES Airtime', points: 450, type: 'airtime', stock: 500 },
    { id: 3, name: '1GB Data Bundle', points: 200, type: 'data', stock: 800 },
    { id: 4, name: '5GB Data Bundle', points: 900, type: 'data', stock: 300 },
    { id: 5, name: 'Carrefour 1000 KES Voucher', points: 1000, type: 'voucher', stock: 200 },
    { id: 6, name: 'Naivas 500 KES Voucher', points: 500, type: 'voucher', stock: 350 }
  ],
  receipts: [
    { id: 1, store: 'Carrefour Westgate', amount: 2500, date: '2024-12-20', status: 'approved', points: 50 },
    { id: 2, store: 'Naivas Kilimani', amount: 1800, date: '2024-12-19', status: 'pending', points: 0 },
    { id: 3, store: 'Quickmart Eastleigh', amount: 3200, date: '2024-12-18', status: 'approved', points: 64 }
  ],
  analytics: {
    revenue: [45000, 52000, 48000, 61000, 58000, 65000],
    transactions: [1245, 1380, 1290, 1556, 1489, 1650],
    users: [980, 1045, 1098, 1156, 1201, 1234],
    topProducts: ['Coca-Cola 500ml', 'Tusker Lager', 'Brookside Milk', 'Safaricom Airtime', 'Omo Washing Powder']
  }
};
