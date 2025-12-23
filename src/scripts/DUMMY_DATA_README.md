# Dummy Data Insertion Script

## Overview

The `insert-dummy-data.js` script provides a simple, fast way to populate the database with basic test data for development and testing purposes.

## Key Differences from Demo Data Script

| Feature | insert-dummy-data.js | seed-demo-data.js |
|---------|----------------------|-------------------|
| **Purpose** | Quick test data insertion | Comprehensive demo simulation |
| **Dependencies** | None (no CSV parsing) | Requires csv-parser |
| **Data Volume** | Minimal (6 users, 10 brands) | Extensive (31 users, 50+ brands) |
| **Complexity** | Simple, fast | Realistic multi-week simulation |
| **Use Case** | Quick testing | Full platform demonstration |

## Usage

### Run the Script

```bash
# Using npm script (recommended)
npm run insert:dummy

# Or directly
node src/scripts/insert-dummy-data.js
```

### What Gets Created

1. **6 Test Users**:
   - Admin: `admin@test.com`
   - CEO: `ceo@test.com`
   - Manager: `manager@test.com`
   - BEO: `beo@test.com`
   - PPG: `ppg@test.com`
   - Shopper: `shopper@test.com`

2. **10 Test Brands**:
   - Major Kenyan brands (Coca-Cola, Brookside, Safaricom, etc.)
   - Random points configurations

3. **5 Test Receipts**:
   - Attached to the shopper account
   - Various amounts and dates
   - Pre-approved status

4. **3 Test Notifications**:
   - Welcome message
   - Points earned notification
   - Promotional message

### Test Credentials

**All accounts use the same password**: `Test@123`

```
• Admin: admin@test.com / Test@123
• CEO: ceo@test.com / Test@123
• Manager: manager@test.com / Test@123
• BEO: beo@test.com / Test@123
• PPG: ppg@test.com / Test@123
• Shopper: shopper@test.com / Test@123
```

## When to Use

### Use `insert:dummy` when:
- ✅ You need quick test data
- ✅ You're doing rapid development iterations
- ✅ You don't need realistic scenarios
- ✅ You want minimal data footprint
- ✅ You're testing basic functionality

### Use `seed:demo` when:
- ✅ You need comprehensive demo data
- ✅ You're demonstrating the platform
- ✅ You need realistic multi-week scenarios
- ✅ You're testing complex workflows
- ✅ You need all 31 user accounts

## Features

### No External Dependencies
- Uses only built-in MySQL and bcrypt
- No CSV file required
- Hardcoded test brands
- Fast execution (< 5 seconds)

### Safe Execution
- Uses `INSERT IGNORE` to prevent duplicates
- Can be run multiple times safely
- Won't overwrite existing data
- Proper error handling

### Colored Output
- Green: Success messages
- Yellow: Info messages
- Blue: Steps and headers
- Red: Errors

## Database Requirements

The script expects:
- MySQL database running
- Database name: `bangopoints` (or set in .env)
- Schema already created (run migrations first)
- Tables: users, shoppers, brands, receipts, receipt_items, notifications, stores

## Troubleshooting

### Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Solution**: Check your `.env` file has correct database credentials.

### No Stores Found
```
No receipts created - stores table empty
```
**Solution**: Run migrations first to create and seed stores:
```bash
npm run migrate
npm run seed
```

### Duplicate Entry Error
```
Duplicate entry 'admin@test.com' for key 'email'
```
**Solution**: This is normal - accounts already exist. The script uses `INSERT IGNORE` to skip duplicates.

## Example Output

```
🚀 Starting dummy data insertion...
✅ Connected to database

📝 Inserting dummy users...
  ✓ Created admin: admin@test.com
  ✓ Created executive: ceo@test.com
  ✓ Created brand_manager: manager@test.com
  ✓ Created beo: beo@test.com
  ✓ Created ppg: ppg@test.com
  ✓ Created shopper: shopper@test.com
  ✓ Created shopper profile

📝 Inserting dummy brands...
  ✓ Created brand: Coca-Cola
  ✓ Created brand: Pepsi
  ...

📝 Inserting dummy receipts...
  ✓ Created receipt 1 with 1500 points
  ✓ Created receipt 2 with 800 points
  ...

📝 Inserting dummy notifications...
  ✓ Created notifications

==================================================
✅ Dummy data insertion completed!
==================================================

📋 Summary:
   - 6 users created
   - 10 brands created
   - 5 receipts created (if applicable)
   - 3 notifications created

🔐 Test Credentials (Password: Test@123 for all):
   • admin: admin@test.com
   • executive: ceo@test.com
   • brand_manager: manager@test.com
   • beo: beo@test.com
   • ppg: ppg@test.com
   • shopper: shopper@test.com

💡 Tip: Use these accounts to test different role functionalities
```

## Integration

### In Development Scripts
Add to your development workflow:
```bash
# Reset and populate database
npm run migrate
npm run seed
npm run insert:dummy
```

### In Installation Script
The `install-dev-macos.sh` now includes an option to seed demo data, but you can manually run dummy data instead:
```bash
./install-dev-macos.sh  # Skip demo data prompt
npm run insert:dummy    # Run this separately
```

## Maintenance

The script is self-contained and requires minimal maintenance:
- Brand list can be updated in the `dummyBrands` array
- User list can be modified in the `dummyUsers` array
- Receipt quantities can be adjusted in the loop
- All changes are in one file: `insert-dummy-data.js`

## See Also

- **seed-demo-data.js**: Comprehensive demo data with CSV integration
- **src/migrations/seed.js**: Base seed data (stores, rewards)
- **README.md**: Main documentation for scripts
