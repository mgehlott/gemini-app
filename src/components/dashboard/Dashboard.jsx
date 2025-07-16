import React, { useState } from 'react';
import { Plus, Search, MessageCircle, Trash2, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { formatRelativeTime, debounce } from '../../utils/helpers';
import { CreateChatroomModal } from './CreateChatroomModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingChatroom, setDeletingChatroom] = useState(null);
  const { chatrooms, setCurrentChatroom, deleteChatroom } = useChatStore();
  const { authData, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const filteredChatrooms = chatrooms.filter(chatroom =>
    chatroom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chatroom.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteChatroom = (chatroom) => {
    setDeletingChatroom(chatroom);
  };

  const confirmDelete = () => {
    if (deletingChatroom) {
      deleteChatroom(deletingChatroom.id);
      toast.success('Chatroom deleted successfully');
      setDeletingChatroom(null);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Gemini Chat
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {authData?.user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Your Chatrooms
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {chatrooms.length} chatroom{chatrooms.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={20} />
              New Chatroom
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search chatrooms..."
              onChange={(e) => debouncedSearch(e.target.value)}
              icon={<Search size={18} />}
              className="max-w-md"
            />
          </div>

          {/* Chatrooms Grid */}
          {filteredChatrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChatrooms.map((chatroom) => (
                <div
                  key={chatroom.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setCurrentChatroom(chatroom)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                        {chatroom.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChatroom(chatroom);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {chatroom.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{chatroom.messageCount} messages</span>
                      <span>{formatRelativeTime(chatroom.createdAt)}</span>
                    </div>
                    {chatroom.lastMessage && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {chatroom.lastMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchQuery ? 'No chatrooms found' : 'No chatrooms yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first chatroom to start chatting with AI'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus size={20} />
                  Create Chatroom
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <CreateChatroomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      <DeleteConfirmModal
        isOpen={!!deletingChatroom}
        onClose={() => setDeletingChatroom(null)}
        onConfirm={confirmDelete}
        chatroomTitle={deletingChatroom?.title}
      />
    </div>
  );
};