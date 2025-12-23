import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, LayoutDashboard, Receipt, Gift, Users, Store, Award, Clock, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../Logo';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const roleNavs = {
      shopper: [
        { path: '/shopper/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/shopper/receipts', icon: Receipt, label: 'Receipts' },
        { path: '/shopper/rewards', icon: Gift, label: 'Rewards' },
        { path: '/shopper/profile', icon: User, label: 'Profile' },
      ],
      admin: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/brands', icon: Award, label: 'Brands' },
        { path: '/admin/stores', icon: Store, label: 'Stores' },
        { path: '/admin/rewards', icon: Gift, label: 'Rewards' },
      ],
      ppg: [
        { path: '/ppg/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/ppg/clock', icon: Clock, label: 'Clock In/Out' },
      ],
      beo: [
        { path: '/beo/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/beo/receipts', icon: Receipt, label: 'Receipts' },
      ],
      brand_manager: [
        { path: '/brand-manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/brand-manager/brands', icon: Award, label: 'My Brands' },
      ],
    };

    return roleNavs[user?.role] || roleNavs.shopper;
  };

  return (
    <div className="min-h-screen bg-dark-500 flex">
      {/* Sidebar */}
      <aside
        className={`bg-dark-400 border-r border-silver-700 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-6">
          <Link 
            to="/" 
            className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity"
            aria-label="BangoPoints Home"
          >
            <Logo variant="icon" size="sm" className="rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-accent-primary">BangoPoints</h1>
              <p className="text-xs text-silver-400">Loyalty Platform</p>
            </div>
          </Link>

          <nav className="space-y-2">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-dark-400 border-b border-silver-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-silver-300 hover:text-accent-primary transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4">
              <button className="relative text-silver-300 hover:text-accent-primary transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-silver-700">
                <div className="text-right">
                  <p className="text-sm font-semibold text-silver-100">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-silver-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
                <div className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-dark-500" />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-silver-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
