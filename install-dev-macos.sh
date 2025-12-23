#!/bin/bash

# BangoPoints - Complete Local Development Installation Script for macOS
# This script installs ALL dependencies for running the entire app in local development

set -e  # Exit on error

echo "============================================================"
echo "BangoPoints - Complete Development Environment Setup"
echo "============================================================"
echo ""
echo "This script will install everything needed for local development:"
echo "  • Homebrew package manager"
echo "  • Node.js 18 LTS"
echo "  • MySQL 8.0 database server"
echo "  • Backend dependencies (Express, JWT, etc.)"
echo "  • Frontend dependencies (React, Vite, PWA)"
echo "  • Database schema and seed data"
echo "  • Environment configuration"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS only."
    exit 1
fi

print_success "Running on macOS $(sw_vers -productVersion)"
echo ""

# ============================================================
# Step 1: Check and install Homebrew
# ============================================================
print_step "Step 1: Installing Homebrew (if needed)..."
if ! command -v brew &> /dev/null; then
    print_info "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
        print_success "Homebrew installed successfully (Apple Silicon)"
    else
        print_success "Homebrew installed successfully (Intel)"
    fi
else
    print_success "Homebrew already installed"
    print_info "Updating Homebrew..."
    brew update
fi
echo ""

# ============================================================
# Step 2: Install Node.js and npm
# ============================================================
print_step "Step 2: Installing Node.js 18 LTS..."
if ! command -v node &> /dev/null; then
    print_info "Node.js not found. Installing Node.js 18 LTS..."
    brew install node@18
    brew link node@18 --force --overwrite
    print_success "Node.js installed successfully"
else
    NODE_VERSION=$(node -v)
    print_success "Node.js already installed: $NODE_VERSION"
    
    # Check if version is 18 or higher
    MAJOR_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_info "Node.js version is less than 18. Upgrading to Node.js 18 LTS..."
        brew install node@18
        brew link node@18 --force --overwrite
        print_success "Node.js upgraded successfully"
    fi
fi

NPM_VERSION=$(npm -v)
print_success "npm version: $NPM_VERSION"
echo ""

# ============================================================
# Step 3: Install MySQL
# ============================================================
print_step "Step 3: Installing MySQL 8.0..."
if ! command -v mysql &> /dev/null; then
    print_info "MySQL not found. Installing MySQL 8.0..."
    brew install mysql@8.0
    
    # Add MySQL to PATH
    echo 'export PATH="/usr/local/opt/mysql@8.0/bin:$PATH"' >> ~/.zprofile
    export PATH="/usr/local/opt/mysql@8.0/bin:$PATH"
    
    # Start MySQL service
    brew services start mysql@8.0
    
    print_success "MySQL 8.0 installed successfully"
    print_info "MySQL service started"
    
    # Wait for MySQL to start
    print_info "Waiting for MySQL to start..."
    sleep 5
    
    print_info "Setting up MySQL root password as 'bangopoints2026'..."
    mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY 'bangopoints2026';
FLUSH PRIVILEGES;
EOF
    print_success "MySQL root password set"
else
    MYSQL_VERSION=$(mysql --version)
    print_success "MySQL already installed: $MYSQL_VERSION"
    
    # Check if MySQL service is running
    if brew services list | grep mysql | grep started &> /dev/null; then
        print_success "MySQL service is running"
    else
        print_info "Starting MySQL service..."
        brew services start mysql
        sleep 3
        print_success "MySQL service started"
    fi
fi
echo ""

# ============================================================
# Step 4: Install Backend Dependencies
# ============================================================
print_step "Step 4: Installing Backend Dependencies..."
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root directory."
    exit 1
fi

print_info "Installing backend npm packages..."
npm install
print_success "Backend dependencies installed successfully"
echo ""

# ============================================================
# Step 5: Install Frontend Dependencies
# ============================================================
print_step "Step 5: Installing Frontend Dependencies..."
if [ ! -d "frontend" ]; then
    print_error "frontend directory not found."
    exit 1
fi

print_info "Installing frontend npm packages..."
cd frontend
npm install
cd ..
print_success "Frontend dependencies installed successfully"
echo ""

# ============================================================
# Step 6: Create necessary directories
# ============================================================
print_step "Step 6: Creating necessary directories..."
mkdir -p logs
mkdir -p public/uploads/receipts
print_success "Directories created (logs, public/uploads/receipts)"
echo ""

# ============================================================
# Step 7: Set up environment configuration
# ============================================================
print_step "Step 7: Setting up environment configuration..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        
        # Update .env with local development settings
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' 's/NODE_ENV=production/NODE_ENV=development/' .env
            sed -i '' 's/DB_PASSWORD=.*/DB_PASSWORD=bangopoints2026/' .env
            sed -i '' 's/ENABLE_CRON=true/ENABLE_CRON=false/' .env
        fi
        
        print_success ".env file created from .env.example"
        print_info "Updated with local development settings"
    else
        print_error ".env.example not found"
        exit 1
    fi
else
    print_info ".env file already exists (not overwritten)"
fi
echo ""

# ============================================================
# Step 8: Set up MySQL database
# ============================================================
print_step "Step 8: Setting up MySQL database..."

# Check if database exists
DB_EXISTS=$(mysql -u root -pbangopoints2026 -e "SHOW DATABASES LIKE 'bangopoints';" 2>/dev/null | grep bangopoints || echo "")

if [ -z "$DB_EXISTS" ]; then
    print_info "Creating bangopoints database..."
    mysql -u root -pbangopoints2026 -e "CREATE DATABASE bangopoints CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    print_success "Database created"
    
    # Create schema
    if [ -f "src/migrations/schema.sql" ]; then
        print_info "Creating database schema..."
        mysql -u root -pbangopoints2026 bangopoints < src/migrations/schema.sql 2>/dev/null
        print_success "Database schema created (15+ tables)"
    else
        print_error "schema.sql not found in src/migrations/"
    fi
    
    # Insert seed data
    if [ -f "src/migrations/seed.sql" ]; then
        print_info "Inserting seed data..."
        mysql -u root -pbangopoints2026 bangopoints < src/migrations/seed.sql 2>/dev/null
        print_success "Seed data inserted (20+ brands, 16 stores, 10 rewards)"
    else
        print_info "seed.sql not found (skipping)"
    fi
else
    print_info "Database 'bangopoints' already exists (skipping creation)"
fi
echo ""

# ============================================================
# Step 9: Verify installation
# ============================================================
print_step "Step 9: Verifying installation..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Installed Versions:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Node.js:  $(node -v)"
echo "  npm:      $(npm -v)"
echo "  MySQL:    $(mysql --version | cut -d' ' -f5 | cut -d',' -f1)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count installed packages
BACKEND_PACKAGES=$(ls node_modules 2>/dev/null | wc -l | xargs)
FRONTEND_PACKAGES=$(ls frontend/node_modules 2>/dev/null | wc -l | xargs)
echo "  Backend packages:  $BACKEND_PACKAGES"
echo "  Frontend packages: $FRONTEND_PACKAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================================
# Step 10: Display next steps
# ============================================================
echo "============================================================"
print_success "Installation Complete!"
echo "============================================================"
echo ""
echo "Your BangoPoints development environment is ready!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Quick Start Guide:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Start Backend Server (Terminal 1):"
echo "   npm run dev"
echo "   → Backend will run on http://localhost:3000"
echo ""
echo "2️⃣  Start Frontend Server (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo "   → Frontend will run on http://localhost:3001"
echo ""
echo "3️⃣  Access the Application:"
echo "   🌐 Web App:  http://localhost:3001"
echo "   🔧 API:      http://localhost:3000/api"
echo "   ❤️  Health:   http://localhost:3000/health"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Development Tips:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Environment Configuration:"
echo "   • Edit .env file to customize settings"
echo "   • Database: bangopoints (user: root, pass: bangopoints2026)"
echo "   • JWT_SECRET: Update for security"
echo "   • SMTP: Configure for email testing (Mailtrap recommended)"
echo ""
echo "🧪 Testing:"
echo "   npm test              # Run all tests"
echo "   npm run test:watch    # Watch mode"
echo "   npm run lint          # Check code quality"
echo ""
echo "📦 Building for Production:"
echo "   npm run build         # Build frontend"
echo "   npm run start:prod    # Start in production mode"
echo ""
echo "🗄️  Database Access:"
echo "   mysql -u root -pbangopoints2026 bangopoints"
echo ""
echo "📚 Documentation:"
echo "   • README.md - Project overview"
echo "   • API_DOCUMENTATION.md - API reference"
echo "   • FRONTEND_GUIDE.md - Frontend development"
echo "   • PWA_GUIDE.md - Progressive Web App features"
echo "   • DEPLOYMENT.md - Production deployment"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Optional: Seed Demo Data"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Would you like to populate the database with demo data?"
echo "   This includes:"
echo "   • Brands from product_master.csv"
echo "   • 10 demo shoppers with transaction history"
echo "   • 5 PPG staff with clock records"
echo "   • 3 BEO staff"
echo "   • 150+ receipts and transactions"
echo "   • Realistic 30-day activity data"
echo ""
read -p "Seed demo data? (y/n): " seed_demo
if [[ "$seed_demo" == "y" || "$seed_demo" == "Y" ]]; then
  print_step "Seeding demo data..."
  npm run seed:demo
  if [ $? -eq 0 ]; then
    print_success "Demo data seeded successfully!"
    echo ""
    echo "🔐 Demo User Credentials:"
    echo "   Admin: admin@bangopoints.com / Admin@123"
    echo "   Shopper: shopper1@bangopoints.com / Demo@123"
    echo "   PPG: ppg1@bangopoints.com / Demo@123"
    echo "   BEO: beo1@bangopoints.com / Demo@123"
  else
    print_warning "Demo data seeding failed (not critical)"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Troubleshooting:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  If MySQL connection fails:"
echo "   mysql -u root -pbangopoints2026 -e 'SELECT 1;'"
echo ""
echo "⚠️  If database needs reset:"
echo "   mysql -u root -pbangopoints2026 -e 'DROP DATABASE bangopoints;'"
echo "   mysql -u root -pbangopoints2026 bangopoints < src/migrations/schema.sql"
echo "   mysql -u root -pbangopoints2026 bangopoints < src/migrations/seed.sql"
echo "   npm run seed:demo  # Re-seed demo data"
echo ""
echo "⚠️  If ports are in use:"
echo "   lsof -ti:3000 | xargs kill -9  # Kill backend"
echo "   lsof -ti:3001 | xargs kill -9  # Kill frontend"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Happy coding! 🚀"
echo ""
echo "============================================================"
