import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/auth/AuthForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { ChatInterface } from './components/chat/ChatInterface';
import { useAuthStore } from './stores/authStore';
import { useChatStore } from './stores/chatStore';
import { useThemeStore } from './stores/themeStore';

function App() {
  const { authData } = useAuthStore();
  const { currentChatroom } = useChatStore();
  const { isDarkMode, setDarkMode } = useThemeStore();

  useEffect(() => {
   
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      const { state } = JSON.parse(savedTheme);
      setDarkMode(state.isDarkMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, [setDarkMode]);

  if (!authData?.isAuthenticated) {
    return (
      <>
        <AuthForm />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {currentChatroom ? <ChatInterface /> : <Dashboard />}
      <Toaster position="top-center" />
    </div>
  );
}

export default App;