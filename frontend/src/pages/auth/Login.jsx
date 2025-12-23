import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserCircle, ShoppingCart, Shield, Users, Building2, Briefcase } from 'lucide-react';
import { mockUsers } from '../../services/mockData';

const Login = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser, updateToken } = useAuthStore();

  // Demo users for quick access
  const demoUsers = [
    { 
      name: 'Admin User', 
      email: 'admin@test.com', 
      role: 'admin', 
      dashboard: '/admin/dashboard',
      icon: Shield,
      color: 'from-purple-500 to-purple-700',
      description: 'Full system access'
    },
    { 
      name: 'Brand Manager', 
      email: 'manager@test.com', 
      role: 'brand_manager', 
      dashboard: '/brand-manager/dashboard',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-700',
      description: 'Manage campaigns & analytics'
    },
    { 
      name: 'Shopper', 
      email: 'shopper@test.com', 
      role: 'shopper', 
      dashboard: '/shopper/dashboard',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-700',
      description: 'Earn & redeem points'
    },
    { 
      name: 'PPG Agent', 
      email: 'ppg@test.com', 
      role: 'ppg', 
      dashboard: '/ppg/dashboard',
      icon: UserCircle,
      color: 'from-orange-500 to-orange-700',
      description: 'Product promotion'
    },
    { 
      name: 'BEO Agent', 
      email: 'beo@test.com', 
      role: 'beo', 
      dashboard: '/beo/dashboard',
      icon: Users,
      color: 'from-teal-500 to-teal-700',
      description: 'Brand engagement'
    },
    { 
      name: 'Executive', 
      email: 'ceo@test.com', 
      role: 'executive', 
      dashboard: '/admin/dashboard',
      icon: Building2,
      color: 'from-red-500 to-red-700',
      description: 'Executive overview'
    },
  ];

  const handleDemoUserClick = (user) => {
    console.log('Demo role selected:', user);
    setSuccessMessage(`Opening ${user.name} dashboard...`);
    setLoading(true);
    
    // Map demo user to role key
    const roleKey = user.role === 'brand_manager' ? 'brandManager' : user.role;
    const mockUser = mockUsers[roleKey];
    
    if (mockUser) {
      // Set mock user in auth store
      updateUser(mockUser);
      updateToken('demo-token-' + Date.now());
      console.log('Mock user set:', mockUser);
    }
    
    // Navigate directly to dashboard after setting user
    setTimeout(() => {
      navigate(user.dashboard);
    }, 500);
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-accent-primary mb-3 text-center">
        Choose Your Role
      </h2>
      <p className="text-silver-400 text-center mb-8">
        Select a role below to explore the BangoPoints platform demo
      </p>

      {successMessage && (
        <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center justify-center gap-2 animate-fade-in">
          <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <span>{successMessage}</span>
        </div>
      )}
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoUsers.map((user, index) => {
          const Icon = user.icon;
          return (
            <button
              key={index}
              onClick={() => handleDemoUserClick(user)}
              disabled={loading}
              className={`
                relative overflow-hidden p-6 rounded-xl border-2 border-silver-800 
                bg-gradient-to-br ${user.color} bg-opacity-10
                hover:bg-opacity-20 hover:border-silver-600 hover:shadow-lg
                transition-all duration-300 transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                group text-left
              `}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${user.color} bg-opacity-30 group-hover:bg-opacity-40 transition-all`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-silver-100 text-lg mb-1">
                    {user.name}
                  </div>
                  <div className="text-sm text-silver-400">
                    {user.description}
                  </div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${user.color} opacity-0 
                group-hover:opacity-10 transition-opacity duration-300
              `} />
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-silver-900 text-center">
        <p className="text-sm text-silver-400 mb-2">
          This is a demo environment. Each role provides access to different features and dashboards.
        </p>
        <p className="text-xs text-silver-500">
          Click any card above to instantly explore that role's dashboard and capabilities.
        </p>
      </div>
    </div>
  );
};

export default Login;
