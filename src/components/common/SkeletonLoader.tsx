// src/components/common/SkeletonLoader.tsx
import React from 'react';

interface SkeletonLoaderProps {
  type: 'card' | 'chart' | 'table' | 'text';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type, 
  count = 1, 
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <div className="rounded-lg w-full h-32 bg-gray-200 dark:bg-tv-border animate-pulse"></div>;
      case 'chart':
        return <div className="rounded-lg w-full h-64 bg-gray-200 dark:bg-tv-border animate-pulse"></div>;
      case 'table':
        return (
          <div className="w-full">
            <div className="h-8 bg-gray-200 dark:bg-tv-border animate-pulse mb-2 rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-tv-border animate-pulse mb-2 rounded"></div>
            ))}
          </div>
        );
      case 'text':
        return <div className="h-4 bg-gray-200 dark:bg-tv-border animate-pulse rounded"></div>;
      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="mb-2">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;