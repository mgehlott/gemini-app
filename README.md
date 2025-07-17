# Gemini-Style AI Chat Application

A modern, fully responsive React chat application that simulates a Gemini-style conversational AI experience with OTP authentication, chatroom management, and real-time messaging features.

## Live Demo

[View Live Application](https://gimini-app.netlify.app/)

## 📋 Project Overview

This application provides a complete chat experience featuring:
- **OTP-based Authentication** with country code selection
- **Chatroom Management** with create/delete functionality
- **Real-time AI Chat Interface** with typing indicators and message history
- **Image Upload Support** with base64 conversion
- **Dark Mode Toggle** with localStorage persistence
- **Responsive Design** optimized for all devices
- **Modern UX** with smooth animations and toast notifications

## 🚀 Setup and Run Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gemini-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📁 Folder Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthForm.jsx              # Main authentication component
│   │   └── CountrySelector.jsx       # Country code selector with search
│   ├── chat/
│   │   ├── ChatInterface.jsx         # Main chat interface
│   │   ├── MessageBubble.jsx         # Individual message component
│   │   └── TypingIndicator.jsx       # AI typing animation
│   ├── dashboard/
│   │   ├── Dashboard.jsx             # Main dashboard with chatroom list
│   │   ├── CreateChatroomModal.jsx   # Modal for creating new chatrooms
│   │   └── DeleteConfirmModal.jsx    # Confirmation modal for deletions
│   └── ui/
│       ├── Button.jsx                # Reusable button component
│       ├── Input.jsx                 # Form input component
│       ├── LoadingSpinner.jsx        # Loading animation
│       ├── MessageSkeleton.jsx       # Loading skeleton for messages
│       └── Modal.jsx                 # Base modal component
├── stores/
│   ├── authStore.js                  # Authentication state management
│   ├── chatStore.js                  # Chat and chatroom state
│   └── themeStore.js                 # Dark mode theme state
├── utils/
│   ├── api.js                        # API simulation functions
│   └── helpers.js                    # Utility functions
├── types/
│   └── index.js                      # JSDoc type definitions
├── App.jsx                           # Main application component
├── main.tsx                          # Application entry point
└── index.css                         # Global styles and Tailwind imports
```

## 🔧 Key Implementation Details

### 1. Throttling Implementation

**AI Response Throttling** (`src/stores/chatStore.js`):
```javascript
// Generate AI response with random delay to simulate real AI processing
if (messageData.sender === 'user') {
  setTimeout(() => {
    set({ isTyping: true });
    
    setTimeout(() => {
      const aiResponse = {
        // ... response data
      };
      
      set((state) => ({
        messages: [...state.messages, aiResponse],
        isTyping: false,
      }));
    }, 1000 + Math.random() * 2000); // 1-3 second random delay
  }, 500);
}
```

**Search Debouncing** (`src/utils/helpers.js`):
```javascript
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Usage in Dashboard component
const debouncedSearch = debounce((query) => {
  setSearchQuery(query);
}, 300);
```

### 2. Pagination Implementation

**Client-side Message Pagination** (`src/stores/chatStore.js`):
```javascript
const generateDummyMessages = (chatroomId, page) => {
  const messages = [];
  const messagesPerPage = 20;
  const startIndex = page * messagesPerPage;
  
  for (let i = 0; i < messagesPerPage; i++) {
    const messageIndex = startIndex + i;
    // Generate messages with proper indexing
    messages.push({
      id: `msg-${chatroomId}-${messageIndex}`,
      // ... message data
    });
  }
  
  return messages.reverse(); // Newest first
};

loadMoreMessages: (chatroomId) => {
  const { page, hasMore } = get();
  
  if (!hasMore) return;
  
  set({ isLoading: true });
  
  setTimeout(() => {
    const newMessages = generateDummyMessages(chatroomId, page);
    
    set((state) => ({
      messages: [...newMessages, ...state.messages], // Prepend older messages
      page: page + 1,
      hasMore: page < 5, // Limit to 5 pages for demo
      isLoading: false,
    }));
  }, 500);
}
```

### 3. Infinite Scroll Implementation

**Reverse Infinite Scroll** (`src/components/chat/ChatInterface.jsx`):
```javascript
useEffect(() => {
  const container = messagesContainerRef.current;
  if (!container) return;

  const handleScroll = () => {
    // Trigger load when scrolled to top
    if (container.scrollTop === 0 && hasMore && !isLoading) {
      loadMoreMessages(currentChatroom.id);
    }
  };

  container.addEventListener('scroll', handleScroll);
  return () => container.removeEventListener('scroll', handleScroll);
}, [hasMore, isLoading, currentChatroom?.id, loadMoreMessages]);
```

**Auto-scroll to Bottom**:
```javascript
useEffect(() => {
  scrollToBottom();
}, [messages, isTyping]);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};
```

### 4. Form Validation Implementation

**Zod Schema Validation** (`src/components/auth/AuthForm.jsx`):
```javascript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const phoneSchema = z.object({
  phone: z.string()
    .min(5, 'Phone number must be at least 5 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});

const otpSchema = z.object({
  otp: z.string()
    .min(4, 'OTP must be at least 4 digits')
    .max(6, 'OTP must be at most 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
});
```

**React Hook Form Integration**:
```javascript
const phoneForm = useForm({
  resolver: zodResolver(phoneSchema),
});

const handlePhoneSubmit = async (data) => {
  if (!selectedCountry) {
    toast.error('Please select a country');
    return;
  }
  // ... validation and submission logic
};
```

**Real-time Validation Display**:
```javascript
{phoneForm.formState.errors.phone && (
  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
    {phoneForm.formState.errors.phone.message}
  </p>
)}








