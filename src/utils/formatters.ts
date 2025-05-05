/**
 * Formats a price to display as currency
 * @param price The price to format
 * @param currency The currency symbol (default: '₹')
 * @param minimumFractionDigits Minimum number of fraction digits (default: 2)
 * @param maximumFractionDigits Maximum number of fraction digits (default: 2)
 * @returns Formatted price string
 */
export const formatPrice = (
    price: number,
    currency: string = '₹',
    minimumFractionDigits: number = 2,
    maximumFractionDigits: number = 2
  ): string => {
    if (isNaN(price)) return `${currency}0.00`;
    
    return `${currency}${price.toLocaleString('en-IN', {
      minimumFractionDigits,
      maximumFractionDigits,
    })}`;
  };
  
  /**
   * Formats a number to display with commas
   * @param value The number to format
   * @param minimumFractionDigits Minimum number of fraction digits (default: 0)
   * @param maximumFractionDigits Maximum number of fraction digits (default: 2)
   * @returns Formatted number string
   */
  export const formatNumber = (
    value: number,
    minimumFractionDigits: number = 0,
    maximumFractionDigits: number = 2
  ): string => {
    if (isNaN(value)) return '0';
    
    return value.toLocaleString('en-IN', {
      minimumFractionDigits,
      maximumFractionDigits,
    });
  };
  
  /**
   * Formats a percentage
   * @param value The percentage value (e.g., 0.15 for 15%)
   * @param multiplier Whether the value needs to be multiplied by 100 (default: false)
   * @param minimumFractionDigits Minimum number of fraction digits (default: 2)
   * @param maximumFractionDigits Maximum number of fraction digits (default: 2)
   * @returns Formatted percentage string
   */
  export const formatPercentage = (
    value: number,
    multiplier: boolean = false,
    minimumFractionDigits: number = 2,
    maximumFractionDigits: number = 2
  ): string => {
    if (isNaN(value)) return '0.00%';
    
    const percentValue = multiplier ? value * 100 : value;
    
    return `${percentValue.toLocaleString('en-IN', {
      minimumFractionDigits,
      maximumFractionDigits,
    })}%`;
  };
  
  /**
   * Formats a date
   * @param timestamp The timestamp to format
   * @param format The format to use (default: 'full')
   * @returns Formatted date string
   */
  export const formatDate = (
    timestamp: number,
    format: 'full' | 'date' | 'time' | 'short' | 'longDate' = 'full'
  ): string => {
    const date = new Date(timestamp);
    
    switch (format) {
      case 'full':
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'date':
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'time':
        return date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'short':
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      case 'longDate':
        return date.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      default:
        return date.toLocaleString('en-IN');
    }
  };
  
  /**
   * Formats a large number to use K, M, B, T suffixes
   * @param value The number to format
   * @param minimumFractionDigits Minimum number of fraction digits (default: 1)
   * @param maximumFractionDigits Maximum number of fraction digits (default: 1)
   * @returns Formatted number string with suffix
   */
  export const formatLargeNumber = (
    value: number,
    minimumFractionDigits: number = 1,
    maximumFractionDigits: number = 1
  ): string => {
    if (isNaN(value)) return '0';
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1_000_000_000_000) {
      return `${sign}${(value / 1_000_000_000_000).toLocaleString('en-IN', {
        minimumFractionDigits,
        maximumFractionDigits,
      })}T`;
    } else if (absValue >= 1_000_000_000) {
      return `${sign}${(value / 1_000_000_000).toLocaleString('en-IN', {
        minimumFractionDigits,
        maximumFractionDigits,
      })}B`;
    } else if (absValue >= 1_000_000) {
      return `${sign}${(value / 1_000_000).toLocaleString('en-IN', {
        minimumFractionDigits,
        maximumFractionDigits,
      })}M`;
    } else if (absValue >= 1_000) {
      return `${sign}${(value / 1_000).toLocaleString('en-IN', {
        minimumFractionDigits,
        maximumFractionDigits,
      })}K`;
    } else {
      return `${sign}${value.toLocaleString('en-IN', {
        minimumFractionDigits,
        maximumFractionDigits,
      })}`;
    }
  };
  
  /**
   * Formats volume
   * @param volume The volume to format
   * @returns Formatted volume string
   */
  export const formatVolume = (volume: number): string => {
    return formatLargeNumber(volume, 0, 2);
  };
  
  /**
   * Formats market cap
   * @param marketCap The market cap to format
   * @returns Formatted market cap string
   */
  export const formatMarketCap = (marketCap: number): string => {
    return `₹${formatLargeNumber(marketCap, 2, 2)}`;
  };
  
  /**
   * Applies positive/negative styling class based on value
   * @param value The value to check
   * @returns CSS class name
   */
  export const getPriceChangeClass = (value: number): string => {
    if (value > 0) return 'text-tv-green';
    if (value < 0) return 'text-tv-red';
    return 'text-tv-text-secondary';
  };
  
  /**
   * Formats a change with arrow
   * @param change The change value
   * @param includeSign Whether to include + sign (default: true)
   * @returns Formatted change string with arrow
   */
  export const formatChangeWithArrow = (change: number, includeSign: boolean = true): string => {
    if (change > 0) {
      return `${includeSign ? '+' : ''}${formatNumber(change, 2, 2)} ↑`;
    } else if (change < 0) {
      return `${formatNumber(change, 2, 2)} ↓`;
    } else {
      return `${formatNumber(change, 2, 2)}`;
    }
  };
  
  /**
   * Formats a change percentage with arrow
   * @param changePercent The change percentage
   * @param includeSign Whether to include + sign (default: true)
   * @returns Formatted change percentage string with arrow
   */
  export const formatChangePercentWithArrow = (
    changePercent: number,
    includeSign: boolean = true
  ): string => {
    if (changePercent > 0) {
      return `${includeSign ? '+' : ''}${formatPercentage(changePercent, false, 2, 2)} ↑`;
    } else if (changePercent < 0) {
      return `${formatPercentage(changePercent, false, 2, 2)} ↓`;
    } else {
      return `${formatPercentage(changePercent, false, 2, 2)}`;
    }
  };
  
  /**
   * Gets the strength label based on ADX value
   * @param adx The ADX value
   * @returns Strength label
   */
  export const getAdxStrengthLabel = (adx: number): string => {
    if (adx < 20) return 'Weak';
    if (adx < 30) return 'Moderate';
    if (adx < 50) return 'Strong';
    return 'Very Strong';
  };
  
  /**
   * Gets the trend label based on +DI and -DI values
   * @param diPlus The +DI value
   * @param diMinus The -DI value
   * @returns Trend label
   */
  export const getAdxTrendLabel = (diPlus: number, diMinus: number): string => {
    if (diPlus > diMinus) return 'Bullish';
    if (diMinus > diPlus) return 'Bearish';
    return 'Neutral';
  };
  
  /**
   * Gets the RSI condition label
   * @param rsi The RSI value
   * @returns RSI condition label
   */
  export const getRsiConditionLabel = (rsi: number): string => {
    if (rsi > 70) return 'Overbought';
    if (rsi < 30) return 'Oversold';
    if (rsi > 50) return 'Bullish';
    if (rsi < 50) return 'Bearish';
    return 'Neutral';
  };