import axios from 'axios';
import { mockApiInterceptor, isMockMode } from './mockApi';

// Constants
const AUTH_STORAGE_KEY = 'auth-storage';

// Helper function to get auth data from Zustand persist storage
const getAuthFromStorage = () => {
  const authStorage = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!authStorage) return { token: null, refreshToken: null };
  
  try {
    const { state } = JSON.parse(authStorage);
    return {
      token: state?.token || null,
      refreshToken: state?.refreshToken || null
    };
  } catch (e) {
    console.error('Error parsing auth storage:', e);
    return { token: null, refreshToken: null };
  }
};

// Helper to update token in store
let authStoreUpdateToken = null;

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the auth store update function (called from authStore)
api.setAuthStoreUpdateToken = (updateFn) => {
  authStoreUpdateToken = updateFn;
};

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    // Check if we're in mock mode
    if (isMockMode()) {
      console.log('[API] Mock mode enabled, intercepting request');
      const method = config.method.toUpperCase();
      const url = config.url.replace('/api', '');
      
      try {
        const mockResponse = await mockApiInterceptor(method, url, config.data);
        if (mockResponse) {
          // Return mock response directly, bypassing axios
          return Promise.reject({
            config,
            isMockResponse: true,
            response: {
              data: mockResponse,
              status: mockResponse.success ? 200 : (mockResponse.code || 400),
              statusText: mockResponse.success ? 'OK' : 'Error',
              headers: {},
              config
            }
          });
        }
      } catch (error) {
        console.error('[API] Mock interceptor error:', error);
      }
    }
    
    // For real API calls, add auth token
    const { token } = getAuthFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if this is a mock response
    if (error.isMockResponse) {
      return Promise.resolve(error.response);
    }
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { refreshToken } = getAuthFromStorage();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post('/api/auth/refresh-token', {
          refreshToken,
        });
        
        const { token: newToken } = response.data;
        
        // Update token using the registered function
        if (authStoreUpdateToken) {
          authStoreUpdateToken(newToken);
        } else {
          console.warn('Auth store update function not registered. Token may not persist correctly.');
        }
        
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Clear storage and redirect to login
        localStorage.removeItem(AUTH_STORAGE_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper to set token
api.setToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
