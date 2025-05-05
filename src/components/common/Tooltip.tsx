// src/components/common/Tooltip.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let x = 0;
      let y = 0;
      
      switch (position) {
        case 'top':
          x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          y = targetRect.top - tooltipRect.height - 8;
          break;
        case 'right':
          x = targetRect.right + 8;
          y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'bottom':
          x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          y = targetRect.bottom + 8;
          break;
        case 'left':
          x = targetRect.left - tooltipRect.width - 8;
          y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          break;
      }
      
      // Ensure tooltip is within viewport
      const padding = 5;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      x = Math.max(padding, Math.min(x, viewportWidth - tooltipRect.width - padding));
      y = Math.max(padding, Math.min(y, viewportHeight - tooltipRect.height - padding));
      
      setTooltipPosition({ x, y });
    }
  }, [isVisible, position]);

  const childWithProps = React.cloneElement(children, {
    ref: targetRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave,
  });

  return (
    <>
      {childWithProps}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 dark:bg-tv-bg-secondary rounded-md shadow-lg pointer-events-none transition-opacity duration-200 ${className}`}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              opacity: isVisible ? 1 : 0,
            }}
          >
            {content}
            <div
              className={`absolute w-2 h-2 bg-gray-800 dark:bg-tv-bg-secondary transform rotate-45 ${
                position === 'top'
                  ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
                  : position === 'right'
                  ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
                  : position === 'bottom'
                  ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2'
                  : 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2'
              }`}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;