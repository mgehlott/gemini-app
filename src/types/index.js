// Type definitions for the application (used as JSDoc comments)

/**
 * @typedef {Object} Country
 * @property {Object} name
 * @property {string} name.common
 * @property {string} cca2
 * @property {Object} idd
 * @property {string} idd.root
 * @property {string[]} idd.suffixes
 * @property {string} flag
 * @property {Object} flags
 * @property {string} flags.png
 * @property {string} flags.svg
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} phone
 * @property {string} countryCode
 * @property {string} name
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Chatroom
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Date} createdAt
 * @property {string} [lastMessage]
 * @property {Date} [lastMessageAt]
 * @property {number} messageCount
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} chatroomId
 * @property {string} content
 * @property {'text' | 'image'} type
 * @property {'user' | 'ai'} sender
 * @property {Date} timestamp
 * @property {string} [imageUrl]
 * @property {boolean} [isTyping]
 */

/**
 * @typedef {Object} AuthData
 * @property {User} user
 * @property {boolean} isAuthenticated
 * @property {string} token
 */

/**
 * @typedef {Object} ChatState
 * @property {Message[]} messages
 * @property {Chatroom | null} currentChatroom
 * @property {boolean} isTyping
 * @property {boolean} isLoading
 * @property {number} page
 * @property {boolean} hasMore
 */

export {};