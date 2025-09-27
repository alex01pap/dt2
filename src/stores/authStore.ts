import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState, LoginFormData, RegisterFormData, UserRole } from '@/types/auth';

interface AuthActions {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

// Mock user data for demo
const mockUser: User = {
  id: '1',
  email: 'admin@company.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'owner',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  createdAt: new Date(),
  lastLoginAt: new Date(),
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginFormData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock authentication - in real app, this would be an API call
          if (credentials.email === 'admin@company.com' && credentials.password === 'password123') {
            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },

      register: async (data: RegisterFormData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'member',
            createdAt: new Date(),
          };
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);