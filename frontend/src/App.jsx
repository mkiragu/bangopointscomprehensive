import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

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

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
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
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<RedirectToDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Private route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Redirect to appropriate dashboard based on role
function RedirectToDashboard() {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const roleRedirects = {
    shopper: '/shopper/dashboard',
    admin: '/admin/dashboard',
    ppg: '/ppg/dashboard',
    ppg_supervisor: '/ppg/dashboard',
    beo: '/beo/dashboard',
    beo_supervisor: '/beo/dashboard',
    brand_manager: '/brand-manager/dashboard',
    area_manager: '/admin/dashboard',
    executive: '/admin/dashboard',
    shop: '/shopper/dashboard',
  };
  
  const redirectPath = roleRedirects[user.role] || '/shopper/dashboard';
  return <Navigate to={redirectPath} replace />;
}

export default App;
