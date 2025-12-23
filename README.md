# BangoPoints Comprehensive Platform

Production-ready loyalty platform for the Kenyan market with points management, receipt processing, and multi-role dashboards.

## Features

- **Multi-role authentication** (10 user types)
- **Points system** with loyalty tiers (Bronze/Silver/Gold)
- **Receipt processing** with image upload
- **Brand management** with 20+ popular Kenyan brands
- **Partner supermarkets** across Nairobi
- **Rewards catalog** (airtime, vouchers, data bundles)
- **Notifications system** (in-app, email, SMS)
- **Role-specific dashboards**
- **Reporting and analytics**
- **Clock in/out system** for PPG staff
- **Advertisement platform**

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL/MariaDB
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer
- **Logging**: Winston
- **Validation**: Joi
- **Scheduling**: node-cron

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+ or MariaDB 10.5+
- npm 9+

## Installation

### Quick Install (macOS)

For macOS users, we provide an automated installation script that installs all dependencies:

```bash
# Clone the repository
git clone <repository-url>
cd bangopointscomprehensive

# Run the installation script
./install-macos.sh
```

The script will automatically:
- ✅ Install Homebrew (if not present)
- ✅ Install Node.js 18 LTS
- ✅ Install MySQL 8.0
- ✅ Install all npm dependencies
- ✅ Create necessary directories
- ✅ Set up database and seed data
- ✅ Configure environment file

### Manual Installation (All Platforms)

1. **Clone the repository**
```bash
git clone <repository-url>
cd bangopointscomprehensive
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Create database and run migrations**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE bangopoints;

# Run schema
mysql -u root -p bangopoints < src/migrations/schema.sql

# Run seed data
mysql -u root -p bangopoints < src/migrations/seed.sql
```

5. **Create logs directory**
```bash
mkdir -p logs
```

## Running the Application

### Development Mode (Separate Servers)

**Backend** (Port 3000):
```bash
npm run dev
```

**Frontend** (Port 3001):
```bash
cd frontend
npm run dev
```

Access frontend at http://localhost:3001

### Production Mode (Single Server)

**Build and start**:
```bash
# Build frontend
npm run build

# Start production server
npm run start:prod
```

Access application at http://localhost:3000

The production server serves both:
- Frontend at `http://localhost:3000/`
- API at `http://localhost:3000/api/`

For detailed production deployment with PM2 and Nginx, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address

### Shoppers
- `GET /api/shoppers/profile` - Get shopper profile
- `PUT /api/shoppers/profile` - Update profile
- `GET /api/shoppers/points` - Get points balance
- `GET /api/shoppers/receipts` - Get receipt history
- `GET /api/shoppers/eligible-brands` - Get eligible brands
- `GET /api/shoppers/tier-info` - Get loyalty tier info
- `POST /api/shoppers/redeem-reward` - Redeem reward

### Receipts
- `POST /api/receipts/upload` - Upload receipt
- `GET /api/receipts` - List receipts
- `GET /api/receipts/:id` - Get receipt details
- `PUT /api/receipts/:id/approve` - Approve receipt
- `PUT /api/receipts/:id/reject` - Reject receipt
- `PUT /api/receipts/:id/flag` - Flag receipt

### Brands
- `GET /api/brands` - List brands
- `GET /api/brands/:id` - Get brand details
- `POST /api/brands` - Create brand (admin)
- `PUT /api/brands/:id` - Update brand
- `PUT /api/brands/:id/toggle-rollover` - Toggle rollover
- `PUT /api/brands/:id/toggle-seeding` - Toggle seeding

### Stores
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store details
- `POST /api/stores` - Create store (admin)

### PPG
- `POST /api/ppg/clock-in` - Clock in for shift
- `POST /api/ppg/clock-out` - Clock out from shift
- `GET /api/ppg/shift-schedule` - Get shift schedule
- `POST /api/ppg/enter-receipt` - Enter receipt data

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `POST /api/notifications` - Create notification

### Rewards
- `GET /api/rewards` - List rewards
- `GET /api/rewards/:id` - Get reward details

### Admin
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/system-health` - System health

## User Roles

1. **Shopper** - End consumers earning/redeeming points
2. **Shop** - Corporate account managing multiple locations
3. **PPG** - Points Processing Guy (receipt entry)
4. **PPG Supervisor** - Oversees PPG teams
5. **BEO** - Back End Officer (receipt processing)
6. **BEO Supervisor** - Manages BEO teams
7. **Area Manager** - Regional oversight
8. **Brand Manager** - Manages campaigns and points rules
9. **Executive** - High-level analytics
10. **Admin** - Full platform control

## Loyalty Tiers

- **Bronze**: 1.0x multiplier (0+ points)
- **Silver**: 1.25x multiplier (10,000+ points)
- **Gold**: 1.5x multiplier (50,000+ points)

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## Linting

```bash
npm run lint
```

## Project Structure

```
bangopointscomprehensive/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   ├── jobs/            # Cron jobs
│   ├── migrations/      # Database migrations
│   └── app.js           # Express app setup
├── public/
│   └── uploads/         # Uploaded files
├── logs/                # Application logs
├── tests/               # Test files
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
├── server.js           # Entry point
└── README.md           # This file
```

## Environment Variables

See `.env.example` for all available configuration options.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- Helmet.js security headers
- Input validation with Joi
- SQL injection prevention
- CORS configuration

## Production Deployment

1. Set `NODE_ENV=production` in .env
2. Configure production database
3. Set strong JWT_SECRET
4. Configure SMTP for emails
5. Set up reverse proxy (Nginx/Apache)
6. Enable SSL/TLS
7. Configure backup strategy
8. Set up monitoring

## Support

For issues and questions, please contact support@bangopoints.com

## License

MIT License - see LICENSE file for details

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Platform**: BangoPoints Loyalty System