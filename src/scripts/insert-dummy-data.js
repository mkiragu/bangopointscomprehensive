#!/usr/bin/env node

/**
 * Insert Dummy Data Script
 * 
 * Simplified script to insert dummy/test data into the database
 * This is separate from the comprehensive demo data seeder
 * 
 * Usage: npm run insert:dummy
 * or: node src/scripts/insert-dummy-data.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bangopoints',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

// Helper function for colored output
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Simple dummy data (no CSV dependency)
const dummyBrands = [
  'Coca-Cola', 'Pepsi', 'Fanta', 'Sprite', 'Tusker',
  'Brookside', 'KCC', 'Safaricom', 'Airtel', 'Kenya Airways',
  'Tuskys', 'Naivas', 'Carrefour', 'Quickmart', 'Chandarana',
  'Samsung', 'Nokia', 'Apple', 'Huawei', 'Techno'
];

const dummyUsers = [
  { email: 'admin@test.com', name: 'Test Admin', role: 'admin' },
  { email: 'ceo@test.com', name: 'Test CEO', role: 'executive' },
  { email: 'manager@test.com', name: 'Test Manager', role: 'brand_manager' },
  { email: 'beo@test.com', name: 'Test BEO', role: 'beo' },
  { email: 'ppg@test.com', name: 'Test PPG', role: 'ppg' },
  { email: 'shopper@test.com', name: 'Test Shopper', role: 'shopper' },
];

async function insertDummyData() {
  let connection;

  try {
    log('\n🚀 Starting dummy data insertion...', 'blue');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    log('✅ Connected to database', 'green');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('Test@123', 10);

    // 1. Insert Users
    log('\n📝 Inserting dummy users...', 'yellow');
    const userIds = {};
    
    for (const user of dummyUsers) {
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];
      
      const [result] = await connection.execute(
        `INSERT IGNORE INTO users (email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
        [user.email, hashedPassword, firstName, lastName, user.role]
      );
      
      if (result.affectedRows > 0) {
        userIds[user.role] = result.insertId;
        log(`  ✓ Created ${user.role}: ${user.email}`, 'green');
      }
    }

    // 2. Insert Shopper profile
    if (userIds.shopper) {
      await connection.execute(
        `INSERT IGNORE INTO shoppers (user_id, phone_number, tier, total_points_earned, current_points, created_at, updated_at)
         VALUES (?, ?, 'bronze', 1000, 500, NOW(), NOW())`,
        [userIds.shopper, '+254712345678']
      );
      log('  ✓ Created shopper profile', 'green');
    }

    // 3. Insert Brands
    log('\n📝 Inserting dummy brands...', 'yellow');
    const brandIds = [];
    
    for (const brandName of dummyBrands.slice(0, 10)) {
      const pointsPerKes = 8 + Math.floor(Math.random() * 8); // 8-15
      const minPurchase = 50 + Math.floor(Math.random() * 151); // 50-200
      const maxPoints = 5000 + Math.floor(Math.random() * 5001); // 5000-10000
      
      const [result] = await connection.execute(
        `INSERT IGNORE INTO brands (name, description, category, points_per_kes, min_purchase_amount, 
         max_points_per_transaction, is_active, enable_rollover, enable_seeding, created_at, updated_at)
         VALUES (?, ?, 'General', ?, ?, ?, 1, 1, 0, NOW(), NOW())`,
        [
          brandName,
          `Test brand ${brandName}`,
          pointsPerKes,
          minPurchase,
          maxPoints
        ]
      );
      
      if (result.affectedRows > 0) {
        brandIds.push(result.insertId);
        log(`  ✓ Created brand: ${brandName}`, 'green');
      }
    }

    // 4. Insert a few receipts (if we have shopper and brands)
    if (userIds.shopper && brandIds.length > 0) {
      log('\n📝 Inserting dummy receipts...', 'yellow');
      
      // Get stores
      const [stores] = await connection.execute('SELECT store_id FROM stores LIMIT 3');
      
      if (stores.length > 0) {
        for (let i = 0; i < 5; i++) {
          const storeId = stores[Math.floor(Math.random() * stores.length)].store_id;
          const brandId = brandIds[Math.floor(Math.random() * brandIds.length)];
          const totalAmount = 100 + Math.floor(Math.random() * 900); // 100-1000
          const pointsAwarded = Math.floor(totalAmount * 10); // Simplified calculation
          
          const daysAgo = Math.floor(Math.random() * 7);
          const purchaseDate = new Date();
          purchaseDate.setDate(purchaseDate.getDate() - daysAgo);
          
          const [result] = await connection.execute(
            `INSERT INTO receipts (shopper_id, store_id, receipt_number, purchase_date, total_amount, 
             points_awarded, status, quality_score, capture_method, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 'approved', 90, 'manual', NOW(), NOW())`,
            [
              userIds.shopper,
              storeId,
              `TEST-${Date.now()}-${i}`,
              purchaseDate,
              totalAmount,
              pointsAwarded
            ]
          );
          
          if (result.affectedRows > 0) {
            // Insert receipt item
            await connection.execute(
              `INSERT INTO receipt_items (receipt_id, brand_id, product_name, quantity, unit_price, 
               total_price, points_earned, created_at)
               VALUES (?, ?, 'Test Product', 1, ?, ?, ?, NOW())`,
              [result.insertId, brandId, totalAmount, totalAmount, pointsAwarded]
            );
            
            log(`  ✓ Created receipt ${i + 1} with ${pointsAwarded} points`, 'green');
          }
        }
      }
    }

    // 5. Insert some notifications
    if (userIds.shopper) {
      log('\n📝 Inserting dummy notifications...', 'yellow');
      
      const notifications = [
        { title: 'Welcome!', message: 'Welcome to BangoPoints', type: 'info', priority: 'medium' },
        { title: 'Points Earned', message: 'You earned 100 points!', type: 'success', priority: 'low' },
        { title: 'New Reward', message: 'Check out new rewards', type: 'promotional', priority: 'low' }
      ];
      
      for (const notif of notifications) {
        await connection.execute(
          `INSERT INTO notifications (user_id, title, message, type, priority, is_read, created_at)
           VALUES (?, ?, ?, ?, ?, 0, NOW())`,
          [userIds.shopper, notif.title, notif.message, notif.type, notif.priority]
        );
      }
      
      log('  ✓ Created notifications', 'green');
    }

    // Summary
    log('\n' + '='.repeat(50), 'blue');
    log('✅ Dummy data insertion completed!', 'green');
    log('='.repeat(50), 'blue');
    
    log('\n📋 Summary:', 'yellow');
    log(`   - ${dummyUsers.length} users created`, 'green');
    log(`   - ${Math.min(10, dummyBrands.length)} brands created`, 'green');
    log(`   - 5 receipts created (if applicable)`, 'green');
    log(`   - 3 notifications created`, 'green');

    log('\n🔐 Test Credentials (Password: Test@123 for all):', 'yellow');
    dummyUsers.forEach(user => {
      log(`   • ${user.role}: ${user.email}`, 'blue');
    });
    
    log('\n💡 Tip: Use these accounts to test different role functionalities', 'yellow');
    log('');

  } catch (error) {
    log('\n❌ Error inserting dummy data:', 'red');
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      log('Database connection closed', 'green');
    }
  }
}

// Run if called directly
if (require.main === module) {
  insertDummyData()
    .then(() => {
      log('\n✅ Script completed successfully!', 'green');
      process.exit(0);
    })
    .catch(error => {
      log('\n❌ Script failed:', 'red');
      console.error(error);
      process.exit(1);
    });
}

module.exports = { insertDummyData };
