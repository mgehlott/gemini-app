import React from 'react';

export const MessageSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((item, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md ${i % 2 === 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'} rounded-lg p-3 shadow-sm animate-pulse`}>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};