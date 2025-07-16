import React from 'react';
import { formatMessageTime } from '../../utils/helpers';

export const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
      isUser 
        ? 'bg-blue-600 text-white' 
        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
    }`}>
      {message.type === 'image' && message.imageUrl && (
        <div className="mb-2">
          <img
            src={message.imageUrl}
            alt="Uploaded image"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      <p className={`text-xs mt-1 ${
        isUser 
          ? 'text-blue-100' 
          : 'text-gray-500 dark:text-gray-400'
      }`}>
        {formatMessageTime(message.timestamp)}
      </p>
    </div>
  );
};