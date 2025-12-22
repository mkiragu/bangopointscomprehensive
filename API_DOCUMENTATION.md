# BangoPoints API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Response Format
All responses follow this format:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... }
}
```

## Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+254712345678",
  "role": "shopper"
}
```

**Roles:** `shopper`, `shop`, `ppg`, `ppg_supervisor`, `beo`, `beo_supervisor`, `area_manager`, `brand_manager`, `executive`, `admin`

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": 1,
    "verificationToken": "..."
  }
}
```

### Login
**POST** `/auth/login`

Authenticate and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "shopper",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Refresh Token
**POST** `/auth/refresh-token`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Forgot Password
**POST** `/auth/forgot-password`

Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "password": "NewSecurePass123!",
  "userId": 1
}
```

### Verify Email
**POST** `/auth/verify-email`

Verify email address.

**Request Body:**
```json
{
  "token": "verification_token",
  "userId": 1
}
```

---

## Shopper Endpoints
**Authentication Required** | **Role:** Shopper

### Get Profile
**GET** `/shoppers/profile`

Get current shopper's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "shopper@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "pointsBalance": 5000,
    "loyaltyTier": "silver",
    "tierMultiplier": 1.25,
    "totalPointsEarned": 12000
  }
}
```

### Get Points Balance
**GET** `/shoppers/points`

Get current points balance and history.

### Get Receipts
**GET** `/shoppers/receipts?page=1&perPage=30`

Get shopper's receipt history.

### Get Eligible Brands
**GET** `/shoppers/eligible-brands`

Get list of brands shopper can earn points from.

### Get Tier Info
**GET** `/shoppers/tier-info`

Get loyalty tier information and benefits.

### Redeem Reward
**POST** `/shoppers/redeem-reward`

Redeem points for a reward.

**Request Body:**
```json
{
  "rewardId": 1
}
```

---

## Receipt Endpoints
**Authentication Required**

### Upload Receipt
**POST** `/receipts/upload`

Upload a new receipt with image.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `storeId` (number) - Store ID
- `totalAmount` (number) - Total amount on receipt
- `receiptNumber` (string, optional) - Receipt number
- `captureMethod` (string) - `phone` or `email`
- `receiptImage` (file) - Receipt image file

### List Receipts
**GET** `/receipts?status=pending&page=1&perPage=30`

List receipts with filters.

**Query Parameters:**
- `status` - Filter by status (pending/approved/rejected/flagged)
- `page` - Page number
- `perPage` - Results per page

### Get Receipt Details
**GET** `/receipts/:id`

Get details of a specific receipt.

### Approve Receipt
**PUT** `/receipts/:id/approve`

Approve a receipt (BEO/Admin only).

**Request Body:**
```json
{
  "items": [
    {
      "brandId": 1,
      "quantity": 2,
      "unitPrice": 150,
      "totalPrice": 300
    }
  ]
}
```

### Reject Receipt
**PUT** `/receipts/:id/reject`

Reject a receipt (BEO/Admin only).

### Flag Receipt
**PUT** `/receipts/:id/flag`

Flag receipt for review (BEO Supervisor).

---

## Brand Endpoints
**Authentication Required**

### List Brands
**GET** `/brands?isActive=true&category=Dairy&page=1`

List all brands with filters.

### Get Brand Details
**GET** `/brands/:id`

Get brand details including configuration.

### Create Brand
**POST** `/brands`

Create new brand (Admin/Brand Manager only).

**Request Body:**
```json
{
  "name": "Brand Name",
  "category": "Dairy",
  "pointsPerKes": 10,
  "minPurchaseAmount": 50,
  "maxPointsPerTransaction": 5000,
  "brandManagerId": 5,
  "isActive": true,
  "rolloverEnabled": false,
  "seedingEnabled": false
}
```

### Update Brand
**PUT** `/brands/:id`

Update brand configuration.

### Toggle Rollover
**PUT** `/brands/:id/toggle-rollover`

Enable/disable points rollover.

**Request Body:**
```json
{
  "enabled": true
}
```

### Toggle Seeding
**PUT** `/brands/:id/toggle-seeding`

Enable/disable points seeding.

### Get Brand Shoppers
**GET** `/brands/:id/shoppers`

Get shoppers who purchased this brand.

### Get Brand Performance
**GET** `/brands/:id/performance`

Get brand performance metrics.

---

## Store Endpoints

### List Stores
**GET** `/stores?chain=Carrefour&page=1`

List all stores with filters.

### Get Store Details
**GET** `/stores/:id`

Get store details.

### Create Store
**POST** `/stores`

Create new store (Admin only).

### Get Store Performance
**GET** `/stores/:id/performance`

Get store performance metrics.

---

## PPG Endpoints
**Authentication Required** | **Role:** PPG

### Clock In
**POST** `/ppg/clock-in`

Clock in for shift.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "clockInTime": "2025-12-22T08:00:00Z",
    "isLate": false
  }
}
```

### Clock Out
**POST** `/ppg/clock-out`

Clock out from shift.

### Get Shift Schedule
**GET** `/ppg/shift-schedule`

Get shift schedule.

### Enter Receipt
**POST** `/ppg/enter-receipt`

Enter receipt data at supermarket.

### Get Performance
**GET** `/ppg/performance`

Get performance metrics.

### Get Payment Calculation
**GET** `/ppg/payment-calculation?period=monthly`

Get payment calculation.

---

## Notification Endpoints
**Authentication Required**

### List Notifications
**GET** `/notifications?isRead=false&page=1`

Get user's notifications.

### Get Unread Count
**GET** `/notifications/unread-count`

Get count of unread notifications.

### Create Notification
**POST** `/notifications`

Create notification (Admin only).

### Mark as Read
**PUT** `/notifications/:id/read`

Mark notification as read.

### Mark All as Read
**PUT** `/notifications/mark-all-read`

Mark all notifications as read.

---

## Reward Endpoints

### List Rewards
**GET** `/rewards?type=airtime&maxPoints=5000`

List available rewards.

### Get Reward Details
**GET** `/rewards/:id`

Get reward details.

---

## Admin Endpoints
**Authentication Required** | **Role:** Admin

### List Users
**GET** `/admin/users?role=shopper&page=1`

List all users with filters.

### Create User
**POST** `/admin/users`

Create new user.

### Update User
**PUT** `/admin/users/:id`

Update user details.

### Get System Health
**GET** `/admin/system-health`

Get system health metrics.

---

## Rate Limiting
API is rate-limited to 100 requests per 15 minutes per IP address.

## Pagination
Most list endpoints support pagination:
- `page` (default: 1) - Page number
- `perPage` (default: 30, max: 100) - Results per page

Response includes:
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "perPage": 30
}
```
