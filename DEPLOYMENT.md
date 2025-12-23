# BangoPoints Deployment Guide

## Single Server Deployment (Production)

The BangoPoints platform is configured to run both backend and frontend on the same server in production mode.

### Prerequisites

- Node.js 18+ and npm 9+
- MySQL 8.0+ or MariaDB
- 2GB+ RAM
- 20GB+ storage

### Quick Deployment (Single Server)

#### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd bangopointscomprehensive

# Install backend dependencies
npm install

# Install frontend dependencies
npm run install:frontend
```

#### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

**Production `.env` settings**:
```bash
# Server
NODE_ENV=production
PORT=3000
API_URL=http://your-domain.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bangopoints
DB_USER=your_db_user
DB_PASSWORD=your_secure_password

# JWT (generate with: openssl rand -base64 64)
JWT_SECRET=your-production-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email (production SMTP)
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-email-password
FROM_EMAIL=BangoPoints <noreply@your-domain.com>

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./public/uploads

# Cron Jobs
ENABLE_CRON=true
TIMEZONE=Africa/Nairobi

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Application (not needed in production - frontend served from same server)
# CLIENT_URL is only used for CORS in development
```

#### 3. Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE bangopoints;"

# Run migrations
mysql -u root -p bangopoints < src/migrations/schema.sql

# Seed initial data
mysql -u root -p bangopoints < src/migrations/seed.sql
```

#### 4. Build Frontend

```bash
# Build frontend for production
npm run build
```

This compiles the React frontend into `frontend/dist/` which the backend will serve.

#### 5. Start Production Server

```bash
# Start with production configuration
npm run start:prod
```

The server will:
- Listen on port 3000 (or your configured PORT)
- Serve frontend at `http://localhost:3000/`
- Serve API at `http://localhost:3000/api/`
- Handle all React Router routing

### Using PM2 (Recommended for Production)

PM2 keeps your app running and restarts it automatically if it crashes.

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name bangopoints --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

**PM2 useful commands**:
```bash
pm2 status              # Check status
pm2 logs bangopoints    # View logs
pm2 restart bangopoints # Restart app
pm2 stop bangopoints    # Stop app
pm2 delete bangopoints  # Remove from PM2
```

### Nginx Reverse Proxy (Recommended)

For production, use Nginx as a reverse proxy with SSL/TLS.

**Install Nginx**:
```bash
sudo apt update
sudo apt install nginx
```

**Nginx configuration** (`/etc/nginx/sites-available/bangopoints`):
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (use Let's Encrypt certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Client max body size (for file uploads)
    client_max_body_size 10M;

    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

**Enable site and restart Nginx**:
```bash
sudo ln -s /etc/nginx/sites-available/bangopoints /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Setup SSL with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Firewall Configuration

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Monitoring and Logs

**Application logs**:
```bash
pm2 logs bangopoints           # PM2 logs
tail -f logs/combined.log       # Application logs
tail -f logs/error.log          # Error logs
```

**System monitoring**:
```bash
pm2 monit                       # PM2 monitoring dashboard
htop                            # System resource usage
```

---

## Development Setup (Separate Servers)

For development, you can run backend and frontend on separate servers.

### Backend (Port 3000)
```bash
npm run dev
```

### Frontend (Port 3001)
```bash
cd frontend
npm run dev
```

In this mode:
- Frontend runs on `http://localhost:3001`
- Backend API runs on `http://localhost:3000`
- CORS is enabled for cross-origin requests

---

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing (`npm test`)
- [ ] Code linted (`npm run lint`)
- [ ] Security scan passed (0 vulnerabilities)
- [ ] Environment variables configured
- [ ] Database created and migrated
- [ ] Frontend built (`npm run build`)

### Deployment
- [ ] Server meets prerequisites
- [ ] Application deployed to server
- [ ] Dependencies installed
- [ ] Database connected
- [ ] PM2 configured and running
- [ ] Nginx reverse proxy configured
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Cron jobs enabled

### Post-deployment
- [ ] Application accessible via domain
- [ ] API endpoints responding
- [ ] Frontend loads correctly
- [ ] Authentication working
- [ ] File uploads working
- [ ] Email notifications working
- [ ] Scheduled jobs running
- [ ] Logs being written
- [ ] PM2 monitoring active

---

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs bangopoints

# Check if port is in use
sudo lsof -i :3000

# Check database connection
mysql -u your_user -p -h localhost bangopoints
```

### Frontend not loading
```bash
# Verify build exists
ls -la frontend/dist/

# Rebuild frontend
npm run build:clean

# Check NODE_ENV
echo $NODE_ENV  # Should be "production"
```

### API requests failing
```bash
# Check if backend is running
curl http://localhost:3000/health

# Check Nginx configuration
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Database connection errors
```bash
# Test database connection
mysql -u your_user -p -h localhost bangopoints

# Check if MySQL is running
sudo systemctl status mysql

# Verify .env database credentials
cat .env | grep DB_
```

---

## Performance Optimization

### Enable Compression
Already configured in Nginx (gzip).

### Cache Static Assets
Frontend assets are automatically cached by browsers (via Vite build).

### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_receipts_shopper ON receipts(shopper_id);
CREATE INDEX idx_receipts_status ON receipts(status);
```

### PM2 Cluster Mode
```bash
# Use all CPU cores
pm2 start server.js -i max --name bangopoints
```

---

## Backup Strategy

### Database Backups
```bash
# Create backup script
cat > /home/user/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u your_user -p'your_password' bangopoints > /backups/bangopoints_$DATE.sql
# Keep last 30 days
find /backups -name "bangopoints_*.sql" -mtime +30 -delete
EOF

chmod +x /home/user/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/user/backup-db.sh
```

### File Backups
```bash
# Backup uploads directory
tar -czf /backups/uploads_$(date +%Y%m%d).tar.gz public/uploads/
```

---

## Scaling Considerations

### Horizontal Scaling
- Use PM2 cluster mode
- Setup load balancer (Nginx, HAProxy)
- Shared session storage (Redis)
- Shared file storage (S3, NFS)

### Vertical Scaling
- Upgrade server resources (CPU, RAM)
- Optimize database queries
- Add database indexes
- Enable query caching

---

## Support

For issues or questions:
- Check logs: `pm2 logs bangopoints`
- Review documentation in `/docs`
- Check GitHub issues

---

**Deployment Status**: ✅ Ready for Production
**Last Updated**: December 2025
