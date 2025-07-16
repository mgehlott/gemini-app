import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateAIResponse = (userMessage) => {
  const responses = [
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's my perspective:",
    "Great point! I'd like to share some thoughts on that:",
    "I appreciate you bringing this up. Here's what I think:",
    "That's a thoughtful question. Let me provide some insights:",
    "I see what you mean. Here's how I'd approach that:",
    "Excellent question! I'd be happy to help with that:",
    "That's a fascinating topic. Here are my thoughts:"
  ]

  return (
    responses[Math.floor(Math.random() * responses.length)] +
    ' ' +
    'This is a simulated AI response to demonstrate the chat functionality. ' +
    'In a real implementation, this would be connected to an actual AI service like Gemini.'
  )
}

const generateDummyMessages = (chatroomId, page) => {
  const messages = []
  const messagesPerPage = 20
  const startIndex = page * messagesPerPage

  for (let i = 0; i < messagesPerPage; i++) {
    const messageIndex = startIndex + i
    const isUser = messageIndex % 2 === 0

    messages.push({
      id: `msg-${chatroomId}-${messageIndex}`,
      chatroomId,
      content: isUser
        ? `User message ${
            messageIndex + 1
          }: This is a sample user message to demonstrate the chat history.`
        : `AI response ${
            messageIndex + 1
          }: This is a sample AI response to demonstrate the conversation flow.`,
      type: 'text',
      sender: isUser ? 'user' : 'ai',
      timestamp: new Date(Date.now() - messageIndex * 60000)
    })
  }

  return messages.reverse()
}

export const useChatStore = create(
  persist(
    (set, get) => ({
      chatrooms: [],
      messages: [],
      currentChatroom: null,
      isTyping: false,
      isLoading: false,
      page: 0,
      hasMore: true,

      addChatroom: (chatroomData) => {
        const newChatroom = {
          ...chatroomData,
          id: Date.now().toString(),
          createdAt: new Date(),
          messageCount: 0
        }

        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms]
        }))
      },

      deleteChatroom: (id) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          currentChatroom: state.currentChatroom?.id === id ? null : state.currentChatroom,
          messages: state.messages.filter((msg) => msg.chatroomId !== id)
        }))
      },

      setCurrentChatroom: (chatroom) => {
        set({
          currentChatroom: chatroom,
          messages: [],
          page: 0,
          hasMore: true
        })

        if (chatroom) {
          const initialMessages = generateDummyMessages(chatroom.id, 0)
          set({ messages: initialMessages, page: 1 })
        }
      },

      addMessage: (messageData) => {
        const newMessage = {
          ...messageData,
          id: Date.now().toString(),
          timestamp: new Date()
        }

        set((state) => ({
          messages: [...state.messages, newMessage]
        }))

      
        if (messageData.chatroomId) {
          get().updateChatroomLastMessage(messageData.chatroomId, messageData.content)
        }

        // Generate AI response if user message
        if (messageData.sender === 'user') {
          setTimeout(() => {
            set({ isTyping: true })

            setTimeout(() => {
              const aiResponse = {
                id: (Date.now() + 1).toString(),
                chatroomId: messageData.chatroomId,
                content: generateAIResponse(messageData.content),
                type: 'text',
                sender: 'ai',
                timestamp: new Date()
              }

              set((state) => ({
                messages: [...state.messages, aiResponse],
                isTyping: false
              }))

              get().updateChatroomLastMessage(messageData.chatroomId, aiResponse.content)
            }, 1000 + Math.random() * 2000)
          }, 500)
        }
      },

      setMessages: (messages) => {
        set({ messages })
      },

      setTyping: (isTyping) => {
        set({ isTyping })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      loadMoreMessages: (chatroomId) => {
        const { page, hasMore } = get()

        if (!hasMore) return

        set({ isLoading: true })

        setTimeout(() => {
          const newMessages = generateDummyMessages(chatroomId, page)

          set((state) => ({
            messages: [...newMessages, ...state.messages],
            page: page + 1,
            hasMore: page < 5, // Limit to 5 pages for demo
            isLoading: false
          }))
        }, 500)
      },

      updateChatroomLastMessage: (chatroomId, message) => {
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? {
                  ...room,
                  lastMessage: message.length > 50 ? message.substring(0, 50) + '...' : message,
                  lastMessageAt: new Date(),
                  messageCount: room.messageCount + 1
                }
              : room
          )
        }))
      }
    }),
    {
      name: 'chat-storage'
    }
  )
)
