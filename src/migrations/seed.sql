-- Seed data for BangoPoints

USE bangopoints;

-- Insert demo admin user
-- Password: Admin@123
INSERT INTO users (email, password_hash, role, first_name, last_name, phone_number, is_active, email_verified) 
VALUES 
('admin@bangopoints.com', '$2a$10$YourHashedPasswordHere', 'admin', 'System', 'Admin', '+254712345678', TRUE, TRUE);

-- Insert Kenyan supermarket stores
INSERT INTO stores (name, chain, location, neighborhood) VALUES
('Carrefour Hub', 'Carrefour', 'Karen', 'Karen'),
('Carrefour Junction', 'Carrefour', 'Thika Road Mall', 'Ruaraka'),
('Naivas Westlands', 'Naivas', 'Westlands', 'Westlands'),
('Naivas Kitengela', 'Naivas', 'Kitengela Town', 'Kitengela'),
('Naivas CBD', 'Naivas', 'Tom Mboya Street', 'CBD'),
('Quickmart Kilimani', 'Quickmart', 'Yaya Centre', 'Kilimani'),
('Quickmart Lavington', 'Quickmart', 'Lavington Mall', 'Lavington'),
('Quickmart Ngong Road', 'Quickmart', 'Ngong Road', 'Dagoretti'),
('Chandarana Runda', 'Chandarana', 'Runda', 'Runda'),
('Chandarana Parklands', 'Chandarana', 'Parklands', 'Parklands'),
('Tuskys Eastleigh', 'Tuskys', 'Eastleigh', 'Eastleigh'),
('Tuskys Rongai', 'Tuskys', 'Rongai', 'Rongai'),
('Cleanshelf Kilimani', 'Cleanshelf', 'Kilimani', 'Kilimani'),
('Cleanshelf Westlands', 'Cleanshelf', 'Westlands', 'Westlands'),
('Zucchini Kileleshwa', 'Zucchini', 'Kileleshwa', 'Kileleshwa'),
('Zucchini Lavington', 'Zucchini', 'Lavington', 'Lavington');

-- Insert popular Kenyan brands
INSERT INTO brands (name, category, points_per_kes, min_purchase_amount, max_points_per_transaction, is_active) VALUES
-- Dairy
('Brookside Milk', 'Dairy', 10, 50, 5000, TRUE),
('KCC Butter', 'Dairy', 12, 100, 7000, TRUE),
('Tuzo Milk', 'Dairy', 10, 50, 5000, TRUE),

-- Cooking Oils
('Elianto Cooking Oil', 'Cooking Oils', 15, 150, 10000, TRUE),
('Fresh Fri', 'Cooking Oils', 14, 150, 10000, TRUE),
('Rina Cooking Oil', 'Cooking Oils', 13, 150, 9000, TRUE),

-- Laundry
('Omo Detergent', 'Laundry', 10, 100, 8000, TRUE),
('Ariel Detergent', 'Laundry', 10, 100, 8000, TRUE),
('Sunlight Bar Soap', 'Laundry', 8, 50, 5000, TRUE),

-- Personal Care
('Geisha Soap', 'Personal Care', 9, 80, 6000, TRUE),
('Colgate Toothpaste', 'Personal Care', 11, 100, 7000, TRUE),
('Nivea Lotion', 'Personal Care', 12, 120, 8000, TRUE),

-- Seasonings
('Royco Mchuzi Mix', 'Seasonings', 8, 50, 5000, TRUE),
('Knorr Cubes', 'Seasonings', 8, 50, 5000, TRUE),

-- Confectionery
('Cadbury Chocolate', 'Confectionery', 10, 80, 6000, TRUE),
('Kasuku Sweets', 'Confectionery', 8, 50, 5000, TRUE),

-- Beverages
('Coca-Cola', 'Beverages', 9, 60, 6000, TRUE),
('Tusker Beer', 'Beverages', 10, 100, 7000, TRUE),
('Brookside Yogurt', 'Beverages', 11, 80, 6000, TRUE),

-- Snacks
('Pringles Chips', 'Snacks', 10, 100, 7000, TRUE);

-- Insert sample rewards
INSERT INTO rewards (name, type, points_cost, inventory_count, is_active) VALUES
('Safaricom Airtime 50 KES', 'airtime', 500, 1000, TRUE),
('Safaricom Airtime 100 KES', 'airtime', 1000, 1000, TRUE),
('Safaricom Airtime 200 KES', 'airtime', 2000, 500, TRUE),
('Airtel Airtime 50 KES', 'airtime', 500, 1000, TRUE),
('Airtel Airtime 100 KES', 'airtime', 1000, 1000, TRUE),
('Shopping Voucher 500 KES', 'voucher', 5000, 200, TRUE),
('Shopping Voucher 1000 KES', 'voucher', 10000, 100, TRUE),
('Safaricom Data 1GB', 'data', 1500, 500, TRUE),
('Safaricom Data 2GB', 'data', 3000, 300, TRUE),
('Airtel Data 1GB', 'data', 1500, 500, TRUE);
