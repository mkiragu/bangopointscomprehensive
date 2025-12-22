-- BangoPoints Database Schema
-- MySQL/MariaDB

-- Create database
CREATE DATABASE IF NOT EXISTS bangopoints CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bangopoints;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('shopper', 'shop', 'ppg', 'ppg_supervisor', 'beo', 'beo_supervisor', 'area_manager', 'brand_manager', 'executive', 'admin') NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- Shoppers table
CREATE TABLE IF NOT EXISTS shoppers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  points_balance INT DEFAULT 0,
  loyalty_tier ENUM('bronze', 'silver', 'gold') DEFAULT 'bronze',
  tier_multiplier DECIMAL(3,2) DEFAULT 1.00,
  total_points_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_loyalty_tier (loyalty_tier)
) ENGINE=InnoDB;

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  points_per_kes INT NOT NULL,
  min_purchase_amount DECIMAL(10,2) NOT NULL,
  max_points_per_transaction INT NOT NULL,
  brand_manager_id BIGINT,
  is_active BOOLEAN DEFAULT TRUE,
  rollover_enabled BOOLEAN DEFAULT FALSE,
  seeding_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_manager_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_brand_manager (brand_manager_id)
) ENGINE=InnoDB;

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  chain VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  neighborhood VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chain (chain),
  INDEX idx_location (location)
) ENGINE=InnoDB;

-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  shopper_id BIGINT NOT NULL,
  ppg_id BIGINT,
  store_id BIGINT NOT NULL,
  receipt_number VARCHAR(100),
  total_amount DECIMAL(10,2) NOT NULL,
  receipt_image_path VARCHAR(500),
  capture_method ENUM('phone', 'email') NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'flagged') DEFAULT 'pending',
  quality_score INT,
  points_awarded INT DEFAULT 0,
  tier_multiplier_applied DECIMAL(3,2),
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shopper_id) REFERENCES shoppers(id) ON DELETE CASCADE,
  FOREIGN KEY (ppg_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_shopper (shopper_id),
  INDEX idx_store (store_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Receipt Items table
CREATE TABLE IF NOT EXISTS receipt_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  receipt_id BIGINT NOT NULL,
  brand_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  points_calculated INT NOT NULL,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
  INDEX idx_receipt (receipt_id),
  INDEX idx_brand (brand_id)
) ENGINE=InnoDB;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  sender_id BIGINT,
  type VARCHAR(50) NOT NULL,
  priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Clock Records table
CREATE TABLE IF NOT EXISTS clock_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ppg_id BIGINT NOT NULL,
  clock_in_time TIMESTAMP NOT NULL,
  clock_out_time TIMESTAMP NULL,
  shift_date DATE NOT NULL,
  is_late BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ppg_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ppg_id (ppg_id),
  INDEX idx_shift_date (shift_date)
) ENGINE=InnoDB;

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  type ENUM('airtime', 'voucher', 'data') NOT NULL,
  points_cost INT NOT NULL,
  inventory_count INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- Redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  shopper_id BIGINT NOT NULL,
  reward_id BIGINT NOT NULL,
  points_spent INT NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shopper_id) REFERENCES shoppers(id) ON DELETE CASCADE,
  FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE,
  INDEX idx_shopper (shopper_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  brand_id BIGINT NOT NULL,
  name VARCHAR(200) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
  INDEX idx_brand (brand_id),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB;

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_by BIGINT NOT NULL,
  assigned_to BIGINT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB;

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  brand_manager_id BIGINT NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  billing_period VARCHAR(20) NOT NULL,
  items_description TEXT,
  status ENUM('draft', 'sent', 'paid') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_manager_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_brand_manager (brand_manager_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('rewards_universe', 'contracted', 'adsense') NOT NULL,
  brand_manager_id BIGINT,
  title VARCHAR(200) NOT NULL,
  image_url VARCHAR(500),
  link_url VARCHAR(500),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  clicks_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_manager_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type (type),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB;
