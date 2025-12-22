#!/bin/bash

# BangoPoints - macOS Installation Script
# This script installs all dependencies required for the BangoPoints platform on macOS

set -e  # Exit on error

echo "=========================================="
echo "BangoPoints - macOS Installation Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS only."
    exit 1
fi

print_success "Running on macOS"
echo ""

# Step 1: Check and install Homebrew
echo "Step 1: Checking for Homebrew..."
if ! command -v brew &> /dev/null; then
    print_info "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    print_success "Homebrew installed successfully"
else
    print_success "Homebrew already installed"
    brew update
fi
echo ""

# Step 2: Install Node.js and npm
echo "Step 2: Checking for Node.js..."
if ! command -v node &> /dev/null; then
    print_info "Node.js not found. Installing Node.js 18 LTS..."
    brew install node@18
    
    # Link Node.js 18
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

# Verify npm
NPM_VERSION=$(npm -v)
print_success "npm version: $NPM_VERSION"
echo ""

# Step 3: Install MySQL
echo "Step 3: Checking for MySQL..."
if ! command -v mysql &> /dev/null; then
    print_info "MySQL not found. Installing MySQL 8.0..."
    brew install mysql@8.0
    
    # Start MySQL service
    brew services start mysql@8.0
    
    print_success "MySQL 8.0 installed successfully"
    print_info "MySQL service started"
    print_info "Default root password is empty. Run 'mysql_secure_installation' to set it up."
else
    MYSQL_VERSION=$(mysql --version)
    print_success "MySQL already installed: $MYSQL_VERSION"
    
    # Check if MySQL service is running
    if brew services list | grep mysql | grep started &> /dev/null; then
        print_success "MySQL service is running"
    else
        print_info "Starting MySQL service..."
        brew services start mysql
        print_success "MySQL service started"
    fi
fi
echo ""

# Step 4: Install project dependencies
echo "Step 4: Installing Node.js project dependencies..."
if [ -f "package.json" ]; then
    print_info "Running npm install..."
    npm install
    print_success "Project dependencies installed successfully"
else
    print_error "package.json not found. Make sure you're in the project root directory."
    exit 1
fi
echo ""

# Step 5: Create necessary directories
echo "Step 5: Creating necessary directories..."
mkdir -p logs
mkdir -p public/uploads/receipts
print_success "Directories created"
echo ""

# Step 6: Set up environment configuration
echo "Step 6: Setting up environment configuration..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success ".env file created from .env.example"
        print_info "Please edit .env file with your configuration"
    else
        print_error ".env.example not found"
    fi
else
    print_info ".env file already exists"
fi
echo ""

# Step 7: Set up MySQL database
echo "Step 7: Setting up MySQL database..."
print_info "Creating bangopoints database..."

# Check if database exists
DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE 'bangopoints';" 2>/dev/null | grep bangopoints || echo "")

if [ -z "$DB_EXISTS" ]; then
    mysql -u root -e "CREATE DATABASE bangopoints CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
        print_error "Failed to create database. You may need to run: mysql_secure_installation"
        print_info "Then manually create the database with: mysql -u root -p < src/migrations/schema.sql"
    }
    
    if [ -f "src/migrations/schema.sql" ]; then
        mysql -u root bangopoints < src/migrations/schema.sql 2>/dev/null && {
            print_success "Database schema created"
        } || {
            print_error "Failed to create schema. Run manually: mysql -u root -p bangopoints < src/migrations/schema.sql"
        }
    fi
    
    if [ -f "src/migrations/seed.sql" ]; then
        mysql -u root bangopoints < src/migrations/seed.sql 2>/dev/null && {
            print_success "Seed data inserted"
        } || {
            print_info "To insert seed data manually, run: mysql -u root -p bangopoints < src/migrations/seed.sql"
        }
    fi
else
    print_info "Database 'bangopoints' already exists"
fi
echo ""

# Step 8: Verify installation
echo "Step 8: Verifying installation..."
echo ""
echo "Installed versions:"
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  MySQL: $(mysql --version | cut -d' ' -f5)"
echo ""

# Step 9: Display next steps
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration:"
echo "   - Set database credentials (DB_USER, DB_PASSWORD)"
echo "   - Set JWT_SECRET to a secure random string"
echo "   - Configure SMTP settings for email"
echo ""
echo "2. If database setup failed, run manually:"
echo "   mysql_secure_installation"
echo "   mysql -u root -p -e 'CREATE DATABASE bangopoints;'"
echo "   mysql -u root -p bangopoints < src/migrations/schema.sql"
echo "   mysql -u root -p bangopoints < src/migrations/seed.sql"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Or start in production mode:"
echo "   npm start"
echo ""
echo "5. Access the API at:"
echo "   http://localhost:3000"
echo ""
echo "6. Check API health:"
echo "   curl http://localhost:3000/health"
echo ""
echo "For more information, see README.md"
echo "=========================================="
