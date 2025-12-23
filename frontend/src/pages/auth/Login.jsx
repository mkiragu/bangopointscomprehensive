import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserCircle, ShoppingCart, Shield, Users, Building2, Briefcase } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Demo users for quick access
  const demoUsers = [
    { 
      name: 'Admin User', 
      email: 'admin@test.com',
      password: 'Test@123',
      role: 'admin', 
      dashboard: '/admin/dashboard',
      icon: Shield,
      color: 'from-purple-500 to-purple-700',
      description: 'Full system access'
    },
    { 
      name: 'Brand Manager', 
      email: 'manager@test.com',
      password: 'Test@123',
      role: 'brand_manager', 
      dashboard: '/brand-manager/dashboard',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-700',
      description: 'Manage campaigns & analytics'
    },
    { 
      name: 'Shopper', 
      email: 'shopper@test.com',
      password: 'Test@123',
      role: 'shopper', 
      dashboard: '/shopper/dashboard',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-700',
      description: 'Earn & redeem points'
    },
    { 
      name: 'PPG Agent', 
      email: 'ppg@test.com',
      password: 'Test@123',
      role: 'ppg', 
      dashboard: '/ppg/dashboard',
      icon: UserCircle,
      color: 'from-orange-500 to-orange-700',
      description: 'Product promotion'
    },
    { 
      name: 'BEO Agent', 
      email: 'beo@test.com',
      password: 'Test@123',
      role: 'beo', 
      dashboard: '/beo/dashboard',
      icon: Users,
      color: 'from-teal-500 to-teal-700',
      description: 'Brand engagement'
    },
    { 
      name: 'Executive', 
      email: 'ceo@test.com',
      password: 'Test@123',
      role: 'executive', 
      dashboard: '/admin/dashboard',
      icon: Building2,
      color: 'from-red-500 to-red-700',
      description: 'Executive overview'
    },
  ];

  const handleDemoUserClick = async (user) => {
    if (loading) return;
    
    console.log('Demo user clicked:', user);
    setLoading(true);
    setMessage(`Logging in as ${user.name}...`);
    
    try {
      // Attempt to login with demo credentials
      const result = await login(user.email, user.password);
      console.log('Login result:', result);
      
      if (result.success && result.user) {
        console.log('Login successful! Redirecting to:', user.dashboard);
        setMessage(`Welcome ${user.name}! Redirecting...`);
        
        // Navigate to the dashboard
        setTimeout(() => {
          navigate(user.dashboard);
        }, 500);
      } else {
        console.error('Login failed:', result);
        setMessage(`Login failed: ${result.error || 'Please try again'}`);
        setLoading(false);
      }
    } catch (err) {
      console.error('Login exception:', err);
      setMessage('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-accent-primary mb-2">
          Welcome to BangoPoints
        </h1>
        <p className="text-silver-300 text-lg">
          Select a demo user to explore the platform
        </p>
      </div>

      {message && (
        <div className="bg-blue-900/30 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg mb-6 text-center animate-fade-in">
          {message}
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
                relative overflow-hidden p-6 rounded-lg border border-silver-800 
                bg-gradient-to-br ${user.color} bg-opacity-10
                hover:bg-opacity-20 hover:border-silver-700 hover:shadow-xl
                transition-all duration-200 transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
                group text-left
              `}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${user.color} bg-opacity-30 group-hover:bg-opacity-40 transition-all`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-silver-100 text-lg mb-1">
                    {user.name}
                  </div>
                  <div className="text-sm text-silver-400 mb-2">
                    {user.description}
                  </div>
                  <div className="text-xs text-silver-500 font-mono">
                    {user.email}
                  </div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${user.color} opacity-0 
                group-hover:opacity-10 transition-opacity duration-200
              `} />
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-silver-500 mb-2">
          All demo accounts use password: <span className="font-mono text-accent-primary">Test@123</span>
        </p>
        <p className="text-xs text-silver-600">
          Click any card above to automatically login and access the respective dashboard
        </p>
      </div>
    </div>
  );
};

export default Login;
