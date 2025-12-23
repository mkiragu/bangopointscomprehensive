import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      
      login: async (email, password) => {
        try {
          console.log('AuthStore: Attempting login for:', email);
          const response = await api.post('/auth/login', { email, password });
          console.log('AuthStore: Login response:', response.data);
          
          // Backend returns { success, message, data: { user, accessToken, refreshToken } }
          if (!response.data || !response.data.data) {
            console.error('AuthStore: Invalid response structure', response.data);
            return {
              success: false,
              error: 'Invalid server response'
            };
          }
          
          const { user, accessToken, refreshToken } = response.data.data;
          
          if (!user || !accessToken) {
            console.error('AuthStore: Missing user or token in response');
            return {
              success: false,
              error: 'Missing authentication data'
            };
          }
          
          console.log('AuthStore: Setting auth state with user:', user);
          set({ user, token: accessToken, refreshToken });
          api.setToken(accessToken);
          
          console.log('AuthStore: Login successful');
          return { success: true, user };
        } catch (error) {
          console.error('AuthStore: Login error:', error);
          return {
            success: false,
            error: error.response?.data?.message || error.message || 'Login failed'
          };
        }
      },
      
      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          return { success: true, data: response.data };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || 'Registration failed'
          };
        }
      },
      
      logout: () => {
        set({ user: null, token: null, refreshToken: null });
        api.setToken(null);
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },
      
      // Update token (used by token refresh)
      updateToken: (token) => {
        set({ token });
        api.setToken(token);
      },
      
      // Initialize token on app load
      initializeAuth: () => {
        const state = get();
        if (state.token) {
          api.setToken(state.token);
        }
        // Register the updateToken function with the API service using a stable reference
        api.setAuthStoreUpdateToken((token) => useAuthStore.getState().updateToken(token));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
