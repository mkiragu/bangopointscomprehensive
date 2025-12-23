# Demo Data Seeding Script

This script populates the BangoPoints database with realistic demo data for testing and demonstration purposes.

## What It Does

The `seed-demo-data.js` script creates:

### 1. **Brands from Product Master CSV**
- Parses `product_master.csv` from the project root
- Extracts unique brand names from product names
- Creates brand records with realistic configurations:
  - Points per KES: 8-15
  - Minimum purchase: 50-200 KES
  - Maximum points per transaction: 5,000-10,000
  - Random category assignment (Dairy, Cooking Oils, Laundry, etc.)

### 2. **Demo Users for All 10 Roles**

#### Executive Level (5 users)
- **CEO**: `ceo@bangopoints.com`
- **COO**: `coo@bangopoints.com`
- **CTO**: `cto@bangopoints.com`
- **CFO**: `cfo@bangopoints.com`
- **CMO**: `cmo@bangopoints.com`

#### Management Level (6 users)
- **Brand Managers** (2): `brandmanager@bangopoints.com`, `brandmanager2@bangopoints.com`
- **Area Managers** (2): `areamanager@bangopoints.com`, `areamanager2@bangopoints.com`
- **BEO Supervisor**: `beosupervisor@bangopoints.com`
- **PPG Supervisor**: `ppgsupervisor@bangopoints.com`

#### Operational Staff
- **Shop Staff**: `shopassistant@bangopoints.com`
- **BEO Staff** (3): `beo1@bangopoints.com` through `beo3@bangopoints.com`
- **PPG Staff** (5): `ppg1@bangopoints.com` through `ppg5@bangopoints.com`

#### Shoppers (10 users)
- `shopper1@bangopoints.com` through `shopper10@bangopoints.com`
- Varied loyalty tiers (Bronze, Silver, Gold)
- Different point balances and histories

#### Administrator
- **Admin**: `admin@bangopoints.com`

**All demo users password**: `Demo@123`  
**Admin password**: `Admin@123`

### 3. **Realistic Transaction Data**

**Receipts** (100-200 receipts):
- 30-day transaction history
- Varied amounts (500-5,000 KES)
- Multiple statuses:
  - Approved (70%)
  - Pending (20%)
  - Rejected (10%)
- Quality scores (70-100)
- Random store assignments

**Receipt Items**:
- 1-5 items per receipt
- Linked to actual brands
- Realistic pricing (100-1,000 KES per item)

### 4. **PPG Clock Records**

- 20 days of attendance data per PPG staff member
- Clock in: 8:00-8:30 AM (with late arrivals)
- Clock out: 5:00-5:30 PM
- GPS coordinates (Nairobi area)
- Complete shift tracking

### 5. **Notifications**

- Receipt approval notifications
- Points expiration warnings
- Tier upgrade announcements
- System messages

## Usage

### Prerequisites

1. Ensure MySQL is running
2. Database must be created and schema migrated
3. `product_master.csv` should be in project root

### Running the Script

```bash
# From project root
npm run seed:demo

# Or directly
node src/scripts/seed-demo-data.js
```

### Configuration

The script uses environment variables from `.env`:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bangopoints
DB_USER=root
DB_PASSWORD=bangopoints2026
```

## Expected Output

```
🚀 Starting BangoPoints Demo Data Seeding...

✅ Connected to database
✅ Extracted 50 unique brands from CSV
👥 Creating demo users for all roles...
✅ Created users for all 10 roles:
   - 1 Admin
   - 5 Executives (CEO, COO, CTO, CFO, CMO)
   - 6 Management (Brand Mgrs, Area Mgrs, Supervisors)
   - 1 Shop Staff
   - 10 Shoppers
   - 5 PPG Staff
   - 3 BEO Staff
📊 Creating shopper profiles...
✅ Created 10 shopper profiles
🏷️  Creating brands...
✅ Created 50 brands from CSV
🧾 Generating receipts and transactions...
✅ Created 150 receipts with items
⏰ Generating PPG clock records...
✅ Created 100 clock records
🔔 Generating notifications...
✅ Created 15 notifications

🎉 Demo data seeding completed successfully!

📋 Summary:
   - 10 shoppers
   - 50 brands
   - 150 receipts
   - 100 clock records
   - 15 notifications

🔐 Demo User Credentials (Password: Demo@123 for all except Admin):

   Executive Level:
   • Admin: admin@bangopoints.com / Admin@123
   • CEO: ceo@bangopoints.com / Demo@123
   • COO: coo@bangopoints.com / Demo@123
   • CTO: cto@bangopoints.com / Demo@123
   • CFO: cfo@bangopoints.com / Demo@123
   • CMO: cmo@bangopoints.com / Demo@123

   Management Level:
   • Brand Manager: brandmanager@bangopoints.com / Demo@123
   • Brand Manager 2: brandmanager2@bangopoints.com / Demo@123
   • Area Manager: areamanager@bangopoints.com / Demo@123
   • Area Manager 2: areamanager2@bangopoints.com / Demo@123
   • BEO Supervisor: beosupervisor@bangopoints.com / Demo@123
   • PPG Supervisor: ppgsupervisor@bangopoints.com / Demo@123

   Operational Level:
   • Shop Staff: shopassistant@bangopoints.com / Demo@123
   • BEO Staff: beo1@bangopoints.com / Demo@123
   • PPG Staff: ppg1@bangopoints.com / Demo@123
   • Shopper: shopper1@bangopoints.com / Demo@123
```

## Data Scenarios

The script creates realistic scenarios to demonstrate:

1. **Shopper Journey**:
   - New shoppers with few transactions
   - Active shoppers with many receipts
   - Tier progression from Bronze to Gold
   - Point accumulation and redemption history

2. **Receipt Processing Workflow**:
   - Pending receipts for BEO review
   - Approved receipts with points awarded
   - Rejected receipts with reasons
   - Quality score variations

3. **PPG Operations**:
   - Regular attendance patterns
   - Late clock-ins triggering alerts
   - Multiple PPG staff across stores
   - Daily performance tracking

4. **Multi-Store Activity**:
   - Transactions across 16 stores
   - Different store chains (Carrefour, Naivas, Quickmart, etc.)
   - Geographic distribution

5. **Brand Performance**:
   - Popular brands with many purchases
   - Brand-specific point accumulation
   - Category-based analytics

## Resetting Demo Data

To reset and reseed:

```bash
# Clear existing data (optional)
mysql -u root -p bangopoints -e "
DELETE FROM receipts WHERE 1=1;
DELETE FROM shoppers WHERE 1=1;
DELETE FROM users WHERE role != 'admin';
"

# Reseed
npm run seed:demo
```

## Testing the Platform

After seeding, you can:

1. **Login as different roles**:
   - Test shopper dashboard and receipt upload
   - Test PPG clock in/out functionality
   - Test BEO receipt approval workflow
   - Test admin dashboards and reports

2. **Verify data**:
   - Check shopper point balances
   - Review receipt statuses
   - Examine PPG attendance records
   - Analyze brand performance

3. **Test workflows**:
   - Receipt approval process
   - Points calculation
   - Tier upgrades
   - Notification delivery

## Notes

- The script uses `INSERT IGNORE` to prevent duplicates
- Existing data is preserved (not cleared automatically)
- Brand names are extracted from the first word of product names in CSV
- All dates are within the last 30 days for recent activity
- Random variations ensure each run creates unique data patterns

## Troubleshooting

**CSV not found**: Place `product_master.csv` in project root or script will use default brands

**Connection errors**: Check `.env` database configuration

**Duplicate entries**: Script safely handles duplicates with IGNORE clause

**Permission issues**: Ensure database user has INSERT permissions

## Integration with Installation Scripts

Both `install-macos.sh` and `install-dev-macos.sh` can optionally run this script after database setup:

```bash
# In installation script
npm run seed:demo
```
