import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'gray' | 'white';
  className?: string;
  fullScreen?: boolean;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false,
  label,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'border-ats-primary border-t-transparent',
    secondary: 'border-gray-300 dark:border-gray-600 border-t-transparent',
    gray: 'border-gray-200 dark:border-gray-700 border-t-transparent',
    white: 'border-white border-t-transparent',
  };
  
  // Full screen wrapper
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white dark:bg-tv-bg-primary bg-opacity-75 dark:bg-opacity-75">
        <div className="flex flex-col items-center">
          <div
            className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
          ></div>
          {label && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{label}</p>
          )}
        </div>
      </div>
    );
  }
  
  // Inline spinner
  return (
    <div className="flex items-center">
      <div
        className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      ></div>
      {label && (
        <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">{label}</p>
      )}
    </div>
  );
};

export default Spinner;