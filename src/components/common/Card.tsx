import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  actions,
  loading = false,
  bordered = true,
  hoverable = false,
}) => {
  // Base card classes
  const baseClasses = 'bg-white dark:bg-tv-bg-secondary rounded-lg overflow-hidden';
  
  // Border classes
  const borderClasses = bordered ? 'border border-gray-200 dark:border-tv-border' : '';
  
  // Hover classes
  const hoverClasses = hoverable ? 'transition-shadow duration-300 hover:shadow-card-hover' : '';
  
  // Loading state
  const loadingContent = (
    <div className="absolute inset-0 bg-white dark:bg-tv-bg-secondary bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ats-primary"></div>
    </div>
  );
  
  return (
    <div className={`${baseClasses} ${borderClasses} ${hoverClasses} shadow-card relative ${className}`}>
      {loading && loadingContent}
      
      {/* Card header */}
      {(title || subtitle || actions) && (
        <div className={`px-4 py-3 border-b border-gray-200 dark:border-tv-border flex justify-between items-center ${headerClassName}`}>
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      
      {/* Card body */}
      <div className={`px-4 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {/* Card footer */}
      {footer && (
        <div className={`px-4 py-3 border-t border-gray-200 dark:border-tv-border ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;