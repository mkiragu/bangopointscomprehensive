import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus, Check, X } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'shopper'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register } = useAuthStore();
  const navigate = useNavigate();

  // Password validation criteria
  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  // Calculate password strength
  useEffect(() => {
    const criteriaMet = Object.values(passwordCriteria).filter(Boolean).length;
    setPasswordStrength(criteriaMet);
  }, [formData.password]);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  // Name validation
  const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters`;
    if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters`;
    return '';
  };

  // Phone validation
  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Invalid Kenyan phone number (e.g., +254712345678)';
    }
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!passwordCriteria.uppercase) return 'Password must contain an uppercase letter';
    if (!passwordCriteria.lowercase) return 'Password must contain a lowercase letter';
    if (!passwordCriteria.number) return 'Password must contain a number';
    if (!passwordCriteria.special) return 'Password must contain a special character';
    return '';
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return '';
  };

  // Validate field on blur
  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
    
    let error = '';
    switch (fieldName) {
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'first_name':
        error = validateName(formData.first_name, 'First name');
        break;
      case 'last_name':
        error = validateName(formData.last_name, 'Last name');
        break;
      case 'phone_number':
        error = validatePhone(formData.phone_number);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword);
        break;
      default:
        break;
    }
    
    setFieldErrors({ ...fieldErrors, [fieldName]: error });
  };

  // Check if form is valid
  const isFormValid = () => {
    // Check all fields are filled
    if (!formData.email || !formData.password || !formData.confirmPassword ||
        !formData.first_name || !formData.last_name || !formData.phone_number) {
      return false;
    }

    // Check password strength
    if (passwordStrength !== 5) {
      return false;
    }

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      return false;
    }

    // Validate all fields
    const errors = {
      email: validateEmail(formData.email),
      first_name: validateName(formData.first_name, 'First name'),
      last_name: validateName(formData.last_name, 'Last name'),
      phone_number: validatePhone(formData.phone_number),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    };

    // Check if any errors exist
    return Object.values(errors).every((error) => !error);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    
    if (result.success) {
      navigate('/login', {
        state: { message: 'Registration successful! Please log in.' }
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-accent-primary mb-6 text-center">
        Create Account
      </h2>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-silver-300 mb-2">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className={`input-field w-full pr-10 ${
                  touched.first_name && (fieldErrors.first_name ? 'border-red-500' : 'border-green-500')
                }`}
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                onBlur={() => handleBlur('first_name')}
              />
              {touched.first_name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {fieldErrors.first_name ? (
                    <X className="w-5 h-5 text-red-500" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {touched.first_name && fieldErrors.first_name && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-silver-300 mb-2">
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className={`input-field w-full pr-10 ${
                  touched.last_name && (fieldErrors.last_name ? 'border-red-500' : 'border-green-500')
                }`}
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                onBlur={() => handleBlur('last_name')}
              />
              {touched.last_name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {fieldErrors.last_name ? (
                    <X className="w-5 h-5 text-red-500" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {touched.last_name && fieldErrors.last_name && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.last_name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-silver-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-500" />
            <input
              type="email"
              required
              className={`input-field w-full pl-10 pr-10 ${
                touched.email && (fieldErrors.email ? 'border-red-500' : 'border-green-500')
              }`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur('email')}
            />
            {touched.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {fieldErrors.email ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </div>
            )}
          </div>
          {touched.email && fieldErrors.email && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-silver-300 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-500" />
            <input
              type="tel"
              required
              className={`input-field w-full pl-10 pr-10 ${
                touched.phone_number && (fieldErrors.phone_number ? 'border-red-500' : 'border-green-500')
              }`}
              placeholder="+254 700 000000"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              onBlur={() => handleBlur('phone_number')}
            />
            {touched.phone_number && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {fieldErrors.phone_number ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </div>
            )}
          </div>
          {touched.phone_number && fieldErrors.phone_number && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.phone_number}</p>
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
              className={`input-field w-full pl-10 pr-10 ${
                touched.password && (fieldErrors.password ? 'border-red-500' : 'border-green-500')
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onBlur={() => handleBlur('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-silver-500 hover:text-accent-primary"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Password Strength:</span>
                <span className={`text-xs font-medium ${
                  passwordStrength <= 2 ? 'text-red-400' :
                  passwordStrength <= 3 ? 'text-yellow-400' :
                  passwordStrength <= 4 ? 'text-blue-400' : 'text-green-400'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <div className="mt-2 space-y-1">
                {[
                  { met: passwordCriteria.length, text: 'At least 8 characters' },
                  { met: passwordCriteria.uppercase, text: 'One uppercase letter' },
                  { met: passwordCriteria.lowercase, text: 'One lowercase letter' },
                  { met: passwordCriteria.number, text: 'One number' },
                  { met: passwordCriteria.special, text: 'One special character' },
                ].map((criterion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {criterion.met ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-gray-500" />
                    )}
                    <span className={`text-xs ${criterion.met ? 'text-green-400' : 'text-gray-500'}`}>
                      {criterion.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {touched.password && fieldErrors.password && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-silver-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              className={`input-field w-full pl-10 pr-10 ${
                touched.confirmPassword && (fieldErrors.confirmPassword ? 'border-red-500' : 'border-green-500')
              }`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              onBlur={() => handleBlur('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-silver-500 hover:text-accent-primary"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {touched.confirmPassword && fieldErrors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-5 h-5" />
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-silver-400">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-primary hover:text-accent-hover font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
