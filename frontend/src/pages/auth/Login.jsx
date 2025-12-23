import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, CheckCircle, UserCircle, ShoppingCart, Shield, Users, Building2, Briefcase } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  
  const { login } = useAuthStore();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  // Handle field blur (touched)
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    // Validate on blur
    const errors = {};
    if (field === 'email') {
      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
    }
    if (field === 'password') {
      const passwordError = validatePassword(formData.password);
      if (passwordError) errors.password = passwordError;
    }
    
    setFieldErrors({ ...fieldErrors, ...errors });
  };

  // Handle input change with validation
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field if it was touched
    if (touched[field]) {
      const errors = { ...fieldErrors };
      if (field === 'email') {
        const emailError = validateEmail(value);
        if (emailError) errors.email = emailError;
        else delete errors.email;
      }
      if (field === 'password') {
        const passwordError = validatePassword(value);
        if (passwordError) errors.password = passwordError;
        else delete errors.password;
      }
      setFieldErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setFieldErrors({
        email: emailError,
        password: passwordError
      });
      setTouched({ email: true, password: true });
      setError('Please fix the validation errors');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting login process...');
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);
      
      if (result.success && result.user) {
        // Use the user returned from login to ensure we have the latest data
        const user = result.user;
        console.log('Login successful! User:', user);
        
        // Show success message
        setSuccessMessage(`Welcome back, ${user.firstName || 'User'}! Redirecting to your dashboard...`);
        
        // Redirect to appropriate dashboard based on role
        const roleRoutes = {
          shopper: '/shopper/dashboard',
          admin: '/admin/dashboard',
          ppg: '/ppg/dashboard',
          beo: '/beo/dashboard',
          brand_manager: '/brand-manager/dashboard',
          executive: '/admin/dashboard',
          area_manager: '/admin/dashboard',
          beo_supervisor: '/beo/dashboard',
          ppg_supervisor: '/ppg/dashboard',
          shop: '/shopper/dashboard'
        };
        
        const redirectPath = roleRoutes[user?.role] || '/shopper/dashboard';
        console.log('Redirecting to:', redirectPath);
        
        // Add a small delay to show the success message, then use full page reload
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1500);
      } else {
        console.error('Login failed:', result);
        setError(result.error || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.email && formData.password && 
           Object.keys(fieldErrors).length === 0;
  };

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
    console.log('Demo user clicked:', user);
    // Show loading message
    setSuccessMessage(`Logging in as ${user.name}...`);
    // Navigate directly to dashboard after a brief moment
    setTimeout(() => {
      window.location.href = user.dashboard;
    }, 500);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-accent-primary mb-6 text-center">
        Sign In
      </h2>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-start gap-2 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4 flex items-start gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-silver-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-500" />
            <input
              type="email"
              required
              disabled={loading}
              className={`input-field w-full pl-10 pr-10 ${
                touched.email && fieldErrors.email ? 'border-red-500' : 
                touched.email && !fieldErrors.email ? 'border-green-500' : ''
              }`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              aria-label="Email address"
              aria-invalid={!!fieldErrors.email}
            />
            {touched.email && !fieldErrors.email && (
              <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {touched.email && fieldErrors.email && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {touched.email && fieldErrors.email && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-silver-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              className={`input-field w-full pl-10 pr-20 ${
                touched.password && fieldErrors.password ? 'border-red-500' : 
                touched.password && !fieldErrors.password ? 'border-green-500' : ''
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              aria-label="Password"
              aria-invalid={!!fieldErrors.password}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {touched.password && !fieldErrors.password && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              {touched.password && fieldErrors.password && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-silver-500 hover:text-accent-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {touched.password && fieldErrors.password && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-silver-400 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 rounded bg-dark-300 border-silver-700 text-accent-primary focus:ring-accent-primary"
              aria-label="Remember me"
            />
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${
            loading || !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-silver-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent-primary hover:text-accent-hover font-semibold">
          Sign up
        </Link>
      </div>

      {/* Demo Users Section */}
      <div className="mt-8 pt-6 border-t border-silver-800">
        <h3 className="text-lg font-semibold text-accent-primary mb-3 text-center">
          Quick Demo Access
        </h3>
        <p className="text-xs text-silver-400 text-center mb-4">
          Click any role below to explore the platform instantly
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {demoUsers.map((user, index) => {
            const Icon = user.icon;
            return (
              <button
                key={index}
                onClick={() => handleDemoUserClick(user)}
                disabled={loading}
                className={`
                  relative overflow-hidden p-4 rounded-lg border border-silver-700 
                  bg-gradient-to-br ${user.color} bg-opacity-10
                  hover:bg-opacity-20 hover:border-silver-600
                  transition-all duration-200 transform hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed
                  group text-left
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${user.color} bg-opacity-20`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-silver-100 text-sm truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-silver-400 truncate">
                      {user.description}
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

        <div className="mt-4 text-center">
          <p className="text-xs text-silver-500">
            All demo accounts use password: <span className="font-mono text-accent-primary">Test@123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
