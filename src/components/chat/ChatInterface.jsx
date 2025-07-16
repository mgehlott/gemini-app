import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image, Copy, MoreVertical } from 'lucide-react';
import { Button } from '../ui/Button';
import { MessageSkeleton } from '../ui/MessageSkeleton';
import { useChatStore } from '../../stores/chatStore';
import { formatMessageTime, copyToClipboard, convertFileToBase64 } from '../../utils/helpers';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import toast from 'react-hot-toast';

export const ChatInterface = () => {
  const [messageInput, setMessageInput] = useState('');
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { 
    currentChatroom, 
    messages, 
    isTyping, 
    isLoading, 
    hasMore,
    setCurrentChatroom, 
    addMessage,
    loadMoreMessages 
  } = useChatStore();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !isLoading) {
        loadMoreMessages(currentChatroom.id);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, currentChatroom?.id, loadMoreMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChatroom) return;

    const messageContent = messageInput.trim();
    setMessageInput('');

    addMessage({
      chatroomId: currentChatroom.id,
      content: messageContent,
      type: 'text',
      sender: 'user',
    });

    toast.success('Message sent');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentChatroom) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      addMessage({
        chatroomId: currentChatroom.id,
        content: `Uploaded image: ${file.name}`,
        type: 'image',
        sender: 'user',
        imageUrl: base64,
      });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleCopyMessage = async (content) => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success('Message copied to clipboard');
    } else {
      toast.error('Failed to copy message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!currentChatroom) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentChatroom(null)}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {currentChatroom.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentChatroom.description}
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {isLoading && hasMore && <MessageSkeleton />}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setHoveredMessage(message.id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <div className="relative group">
              <MessageBubble message={message} />
              {hoveredMessage === message.id && (
                <button
                  onClick={() => handleCopyMessage(message.content)}
                  className="absolute top-2 right-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Copy message"
                >
                  <Copy size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Image size={20} />
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-3"
          >
            <Send size={20} />
          </Button>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};