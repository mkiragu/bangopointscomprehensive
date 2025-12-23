import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Landing page
import Landing from './pages/Landing';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Shopper pages
import ShopperDashboard from './pages/shopper/Dashboard';
import ShopperReceipts from './pages/shopper/Receipts';
import ShopperRewards from './pages/shopper/Rewards';
import ShopperProfile from './pages/shopper/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminBrands from './pages/admin/Brands';
import AdminStores from './pages/admin/Stores';
import AdminRewards from './pages/admin/Rewards';

// PPG pages
import PPGDashboard from './pages/ppg/Dashboard';
import PPGClockIn from './pages/ppg/ClockIn';

// BEO pages
import BEODashboard from './pages/beo/Dashboard';
import BEOReceipts from './pages/beo/Receipts';

// Brand Manager pages
import BrandManagerDashboard from './pages/brandManager/Dashboard';
import BrandManagerBrands from './pages/brandManager/Brands';
import BrandManagerBilling from './pages/brandManager/Billing';
import BrandManagerAnalytics from './pages/brandManager/Analytics';
import BrandManagerCustomers from './pages/brandManager/Customers';
import BrandManagerNotifications from './pages/brandManager/Notifications';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  
  // Initialize auth on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Demo role selector as landing page */}
        <Route path="/" element={<Login />} />
        
        {/* Original landing page moved to /home */}
        <Route path="/home" element={<Landing />} />
        
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          {/* Legacy routes for backwards compatibility */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected routes */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          {/* Shopper routes */}
          <Route path="/shopper/dashboard" element={<ShopperDashboard />} />
          <Route path="/shopper/receipts" element={<ShopperReceipts />} />
          <Route path="/shopper/rewards" element={<ShopperRewards />} />
          <Route path="/shopper/profile" element={<ShopperProfile />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />

          {/* PPG routes */}
          <Route path="/ppg/dashboard" element={<PPGDashboard />} />
          <Route path="/ppg/clock" element={<PPGClockIn />} />

          {/* BEO routes */}
          <Route path="/beo/dashboard" element={<BEODashboard />} />
          <Route path="/beo/receipts" element={<BEOReceipts />} />

          {/* Brand Manager routes */}
          <Route path="/brand-manager/dashboard" element={<BrandManagerDashboard />} />
          <Route path="/brand-manager/brands" element={<BrandManagerBrands />} />
          <Route path="/brand-manager/billing" element={<BrandManagerBilling />} />
          <Route path="/brand-manager/analytics" element={<BrandManagerAnalytics />} />
          <Route path="/brand-manager/customers" element={<BrandManagerCustomers />} />
          <Route path="/brand-manager/notifications" element={<BrandManagerNotifications />} />
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Private route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
}



export default App;
