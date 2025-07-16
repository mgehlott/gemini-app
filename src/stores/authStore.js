import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      authData: null,
      isLoading: false,
      login: (user, token) => {
        set({
          authData: {
            user,
            isAuthenticated: true,
            token,
          },
        });
      },
      logout: () => {
        set({ authData: null });
      },
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);