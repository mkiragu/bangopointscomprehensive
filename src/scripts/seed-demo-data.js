#!/usr/bin/env node

/**
 * Demo Data Seeding Script for BangoPoints Platform
 * 
 * This script populates the database with realistic demo data
 * Usage: node src/scripts/seed-demo-data.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const csv = require('csv-parser');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'bangopoints2026',
  database: process.env.DB_NAME || 'bangopoints',
  port: process.env.DB_PORT || 3306
};

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = (array) => array[Math.floor(Math.random() * array.length)];

const parseBrandsFromCSV = async () => {
  const csvPath = path.join(__dirname, '../../product_master.csv');
  const brands = new Set();
  
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(csvPath)) {
      console.log('⚠️  product_master.csv not found, using default brands');
      resolve([]);
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        const productName = row.product_name || row.Product_Name || row.PRODUCT_NAME || '';
        if (productName) {
          const brandName = productName.split(' ')[0];
          if (brandName && brandName.length > 2) {
            brands.add(brandName.toUpperCase());
          }
        }
      })
      .on('end', () => {
        console.log(`✅ Extracted ${brands.size} unique brands from CSV`);
        resolve(Array.from(brands));
      })
      .on('error', reject);
  });
};

async function seedDemoData() {
  let connection;
  
  try {
    console.log('🚀 Starting BangoPoints Demo Data Seeding...\n');
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    const csvBrands = await parseBrandsFromCSV();
    const demoPasswordHash = await bcrypt.hash('Demo@123', 10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Insert demo users
    console.log('\n👥 Creating demo users...');
    const shopperEmails = [];
    const ppgUserIds = [];
    const beoUserIds = [];
    
    // Shoppers
    for (let i = 1; i <= 10; i++) {
      const email = `shopper${i}@bangopoints.com`;
      shopperEmails.push(email);
      await connection.query(
        `INSERT IGNORE INTO users (email, password_hash, role, first_name, last_name, phone_number, is_active, email_verified) 
         VALUES (?, ?, 'shopper', ?, ?, ?, TRUE, TRUE)`,
        [email, demoPasswordHash, `Shopper${i}`, `User`, `+25471200${100+i}`]
      );
    }
    
    // PPG Staff
    for (let i = 1; i <= 5; i++) {
      const email = `ppg${i}@bangopoints.com`;
      const [result] = await connection.query(
        `INSERT IGNORE INTO users (email, password_hash, role, first_name, last_name, phone_number, is_active, email_verified) 
         VALUES (?, ?, 'ppg', ?, ?, ?, TRUE, TRUE)`,
        [email, demoPasswordHash, `PPG${i}`, `Staff`, `+25471207${i}`]
      );
      if (result.insertId) ppgUserIds.push(result.insertId);
    }
    
    // BEO Staff
    for (let i = 1; i <= 3; i++) {
      const email = `beo${i}@bangopoints.com`;
      const [result] = await connection.query(
        `INSERT IGNORE INTO users (email, password_hash, role, first_name, last_name, phone_number, is_active, email_verified) 
         VALUES (?, ?, 'beo', ?, ?, ?, TRUE, TRUE)`,
        [email, demoPasswordHash, `BEO${i}`, `Officer`, `+25471205${i}`]
      );
      if (result.insertId) beoUserIds.push(result.insertId);
    }
    
    // Admin
    await connection.query(
      `INSERT IGNORE INTO users (email, password_hash, role, first_name, last_name, phone_number, is_active, email_verified) 
       VALUES (?, ?, 'admin', 'System', 'Administrator', '+254712000001', TRUE, TRUE)`,
      ['admin@bangopoints.com', adminPasswordHash]
    );
    
    // Brand Manager
    await connection.query(
      `INSERT IGNORE INTO users (email, password_hash, role, first_name, last_name, phone_number, is_active, email_verified) 
       VALUES (?, ?, 'brand_manager', 'Brand', 'Manager', '+254712000015', TRUE, TRUE)`,
      ['brandmanager@bangopoints.com', demoPasswordHash]
    );
    
    console.log(`✅ Created ${shopperEmails.length} shoppers, ${ppgUserIds.length} PPG staff, ${beoUserIds.length} BEO staff, 1 brand manager`);

    // Get user IDs
    const [shopperUsers] = await connection.query(
      `SELECT id, email FROM users WHERE role = 'shopper' LIMIT 10`
    );

    // Insert shopper profiles
    console.log('\n📊 Creating shopper profiles...');
    for (const user of shopperUsers) {
      await connection.query(
        `INSERT IGNORE INTO shoppers (user_id, total_points_earned, current_points_balance, loyalty_tier) 
         VALUES (?, ?, ?, ?)`,
        [user.id, randomBetween(0, 50000), randomBetween(0, 10000), randomBetween(0, 10000) > 5000 ? 'bronze' : (randomBetween(0, 10000) > 8000 ? 'silver' : 'gold')]
      );
    }
    console.log(`✅ Created ${shopperUsers.length} shopper profiles`);

    // Insert brands from CSV
    console.log('\n🏷️  Creating brands...');
    const brandCategories = ['Dairy', 'Cooking Oils', 'Laundry', 'Personal Care', 'Seasonings', 'Confectionery', 'Beverages', 'Snacks'];
    const brandIds = [];
    
    for (const brandName of csvBrands.slice(0, 50)) {
      const [result] = await connection.query(
        `INSERT IGNORE INTO brands (name, category, points_per_kes, min_purchase_amount, max_points_per_transaction, is_active) 
         VALUES (?, ?, ?, ?, ?, TRUE)`,
        [brandName, randomPick(brandCategories), randomBetween(8, 15), randomBetween(50, 200), randomBetween(5000, 10000)]
      );
      if (result.insertId) brandIds.push(result.insertId);
    }
    console.log(`✅ Created ${brandIds.length} brands from CSV`);

    // Get store IDs
    const [stores] = await connection.query(`SELECT id FROM stores LIMIT 16`);
    const storeIds = stores.map(s => s.id);

    // Generate receipts and transactions
    console.log('\n🧾 Generating receipts and transactions...');
    let receiptCount = 0;
    
    for (const shopper of shopperUsers) {
      const numReceipts = randomBetween(5, 20);
      
      for (let i = 0; i < numReceipts; i++) {
        const receiptDate = randomDate(startDate, endDate);
        const totalAmount = randomBetween(500, 5000);
        const storeId = randomPick(storeIds);
        const status = randomPick(['approved', 'approved', 'approved', 'pending', 'rejected']);
        
        const [receiptResult] = await connection.query(
          `INSERT INTO receipts (shopper_id, store_id, receipt_number, receipt_date, total_amount, status, quality_score, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [shopper.id, storeId, `RCP${Date.now()}${randomBetween(1000, 9999)}`, receiptDate, totalAmount, status, randomBetween(70, 100), receiptDate]
        );
        
        receiptCount++;
        
        if (status === 'approved' && brandIds.length > 0) {
          const numItems = randomBetween(1, 5);
          for (let j = 0; j < numItems; j++) {
            const brandId = randomPick(brandIds);
            const itemPrice = randomBetween(100, 1000);
            await connection.query(
              `INSERT INTO receipt_items (receipt_id, brand_id, item_name, unit_price, quantity, total_price) 
               VALUES (?, ?, ?, ?, ?, ?)`,
              [receiptResult.insertId, brandId, 'Product Item', itemPrice, randomBetween(1, 3), itemPrice]
            );
          }
        }
      }
    }
    console.log(`✅ Created ${receiptCount} receipts with items`);

    // Generate clock records for PPG
    console.log('\n⏰ Generating PPG clock records...');
    let clockCount = 0;
    for (const userId of ppgUserIds) {
      const numDays = 20;
      for (let i = 0; i < numDays; i++) {
        const clockDate = new Date(startDate);
        clockDate.setDate(clockDate.getDate() + i);
        const clockIn = new Date(clockDate);
        clockIn.setHours(8, randomBetween(0, 30), 0);
        const clockOut = new Date(clockDate);
        clockOut.setHours(17, randomBetween(0, 30), 0);
        
        await connection.query(
          `INSERT IGNORE INTO clock_records (user_id, clock_in_time, clock_out_time, location_latitude, location_longitude) 
           VALUES (?, ?, ?, ?, ?)`,
          [userId, clockIn, clockOut, -1.2921 + (Math.random() * 0.1), 36.8219 + (Math.random() * 0.1)]
        );
        clockCount++;
      }
    }
    console.log(`✅ Created ${clockCount} clock records`);

    // Generate notifications
    console.log('\n🔔 Generating notifications...');
    let notificationCount = 0;
    for (const shopper of shopperUsers.slice(0, 5)) {
      const notifications = [
        ['Receipt Approved', 'Your receipt has been approved! You earned 500 points.', 'high'],
        ['Points Expiring Soon', 'You have 1000 points expiring on Oct 31st.', 'medium'],
        ['Tier Upgraded', 'Congratulations! You have been upgraded to Silver tier.', 'high'],
      ];
      
      for (const [title, message, priority] of notifications) {
        await connection.query(
          `INSERT INTO notifications (user_id, title, message, priority, type, created_at) 
           VALUES (?, ?, ?, ?, 'system', ?)`,
          [shopper.id, title, message, priority, randomDate(startDate, endDate)]
        );
        notificationCount++;
      }
    }
    console.log(`✅ Created ${notificationCount} notifications`);

    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - ${shopperUsers.length} shoppers`);
    console.log(`   - ${brandIds.length} brands`);
    console.log(`   - ${receiptCount} receipts`);
    console.log(`   - ${clockCount} clock records`);
    console.log(`   - ${notificationCount} notifications`);
    console.log('\n🔐 Demo User Credentials:');
    console.log('   Admin: admin@bangopoints.com / Admin@123');
    console.log('   Brand Manager: brandmanager@bangopoints.com / Demo@123');
    console.log('   Shopper: shopper1@bangopoints.com / Demo@123');
    console.log('   PPG: ppg1@bangopoints.com / Demo@123');
    console.log('   BEO: beo1@bangopoints.com / Demo@123\n');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  seedDemoData().then(() => process.exit(0));
}

module.exports = { seedDemoData };
