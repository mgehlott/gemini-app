import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          document.documentElement.classList.toggle('dark', newDarkMode);
          return { isDarkMode: newDarkMode };
        });
      },
      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
        document.documentElement.classList.toggle('dark', isDark);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);