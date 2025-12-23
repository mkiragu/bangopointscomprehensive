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
          const response = await api.post('/auth/login', { email, password });
          const { user, token, refreshToken } = response.data;
          
          set({ user, token, refreshToken });
          api.setToken(token);
          
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || 'Login failed'
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
