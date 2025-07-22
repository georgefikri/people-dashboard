import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { MOCK_USERS, ADMIN_CREDENTIALS } from '@/constants/mockData';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check hardcoded admin credentials
        if (
          email === ADMIN_CREDENTIALS.email &&
          password === ADMIN_CREDENTIALS.password
        ) {
          const adminUser = MOCK_USERS.find((user) => user.email === email);
          if (adminUser) {
            set({ user: adminUser, isAuthenticated: true });
            return true;
          }
        }

        // Check other mock users (for testing different roles)
        const user = MOCK_USERS.find((u) => u.email === email);
        if (user && password === 'demo123') {
          // Generic password for demo users
          set({ user, isAuthenticated: true });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
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
