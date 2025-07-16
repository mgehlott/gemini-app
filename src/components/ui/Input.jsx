import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref} 
          className={`
            w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
            rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100 placeholder-gray-500 
            dark:placeholder-gray-400 transition-colors duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

