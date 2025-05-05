import React from 'react';

interface ATSLogoProps {
  className?: string;
  height?: number;
}

/**
 * ATS Logo Component
 * Renders the ATS logo with configurable size and className
 */
const ATSLogo: React.FC<ATSLogoProps> = ({ className = '', height = 40 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/assets/images/ATS Logo_white_no_bg.png" 
        alt="ATS - Advanced Trading System"
        height={height}
        className="h-auto"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default ATSLogo;