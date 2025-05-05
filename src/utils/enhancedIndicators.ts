// src/utils/enhancedIndicators.ts
import { StockData } from '../types/stock';
import { calculateSMA, calculateEMA } from './indicators';

/**
 * Calculates Bollinger Bands for the given stock data
 * @param data Array of stock data
 * @param period Period for SMA (default: 20)
 * @param multiplier Standard deviation multiplier (default: 2)
 * @returns Object containing upper, middle, and lower band arrays
 */
export const calculateBollingerBands = (
  data: StockData[],
  period: number = 20,
  multiplier: number = 2
): {
  upper: number[];
  middle: number[];
  lower: number[];
  bandwidth: number[];
  percentB: number[];
} => {
  // Extract closing prices
  const closePrices = data.map(d => d.close);
  
  // Calculate middle band (SMA)
  const middleBand = calculateSMA(closePrices, period);
  
  const upperBand: number[] = [];
  const lowerBand: number[] = [];
  const bandwidth: number[] = [];
  const percentB: number[] = [];
  
  // Calculate upper and lower bands
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upperBand.push(NaN);
      lowerBand.push(NaN);
      bandwidth.push(NaN);
      percentB.push(NaN);
      continue;
    }
    
    // Calculate standard deviation
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(closePrices[i - j] - middleBand[i], 2);
    }
    
    const stdDev = Math.sqrt(sum / period);
    
    const upper = middleBand[i] + multiplier * stdDev;
    const lower = middleBand[i] - multiplier * stdDev;
    
    upperBand.push(upper);
    lowerBand.push(lower);
    
    // Calculate bandwidth
    bandwidth.push((upper - lower) / middleBand[i]);
    
    // Calculate %B
    percentB.push((closePrices[i] - lower) / (upper - lower));
  }
  
  return {
    upper: upperBand,
    middle: middleBand,
    lower: lowerBand,
    bandwidth,
    percentB,
  };
};

/**
 * Calculates Stochastic Oscillator
 * @param data Array of stock data
 * @param kPeriod Period for %K (default: 14)
 * @param dPeriod Period for %D (default: 3)
 * @returns Object containing %K and %D arrays
 */
export const calculateStochastic = (
  data: StockData[],
  kPeriod: number = 14,
  dPeriod: number = 3
): {
  k: number[];
  d: number[];
} => {
  const kValues: number[] = [];
  
  // Calculate %K
  for (let i = 0; i < data.length; i++) {
    if (i < kPeriod - 1) {
      kValues.push(NaN);
      continue;
    }
    
    // Find highest high and lowest low in the period
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    
    for (let j = 0; j < kPeriod; j++) {
      const current = data[i - j];
      highestHigh = Math.max(highestHigh, current.high);
      lowestLow = Math.min(lowestLow, current.low);
    }
    
    // Calculate %K
    const range = highestHigh - lowestLow;
    const k = range === 0 ? 50 : ((data[i].close - lowestLow) / range) * 100;
    kValues.push(k);
  }
  
  // Calculate %D (SMA of %K)
  const dValues: number[] = [];
  
  for (let i = 0; i < kValues.length; i++) {
    if (i < kPeriod - 1 + dPeriod - 1) {
      dValues.push(NaN);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < dPeriod; j++) {
      sum += kValues[i - j];
    }
    
    dValues.push(sum / dPeriod);
  }
  
  return {
    k: kValues,
    d: dValues,
  };
};

/**
 * Calculates On-Balance Volume (OBV)
 * @param data Array of stock data
 * @returns Array of OBV values
 */
export const calculateOBV = (data: StockData[]): number[] => {
  const obvValues: number[] = [0]; // Start with 0
  
  for (let i = 1; i < data.length; i++) {
    const previousOBV = obvValues[i - 1];
    const currentClose = data[i].close;
    const previousClose = data[i - 1].close;
    const currentVolume = data[i].volume;
    
    // Calculate current OBV
    if (currentClose > previousClose) {
      // Bullish day, add volume
      obvValues.push(previousOBV + currentVolume);
    } else if (currentClose < previousClose) {
      // Bearish day, subtract volume
      obvValues.push(previousOBV - currentVolume);
    } else {
      // Unchanged, keep OBV the same
      obvValues.push(previousOBV);
    }
  }
  
  return obvValues;
};

/**
 * Calculates Ichimoku Cloud components
 * @param data Array of stock data
 * @returns Object containing Ichimoku cloud components
 */
export const calculateIchimokuCloud = (data: StockData[]): {
  tenkanSen: number[];
  kijunSen: number[];
  senkouSpanA: number[];
  senkouSpanB: number[];
  chikouSpan: number[];
} => {
  const tenkanSen: number[] = []; // Conversion Line (9)
  const kijunSen: number[] = []; // Base Line (26)
  const senkouSpanA: number[] = []; // Leading Span A
  const senkouSpanB: number[] = []; // Leading Span B
  const chikouSpan: number[] = []; // Lagging Span
  
  // Calculate Tenkan-sen (Conversion Line)
  for (let i = 0; i < data.length; i++) {
    if (i < 9 - 1) {
      tenkanSen.push(NaN);
      continue;
    }
    
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    
    for (let j = 0; j < 9; j++) {
      const current = data[i - j];
      highestHigh = Math.max(highestHigh, current.high);
      lowestLow = Math.min(lowestLow, current.low);
    }
    
    tenkanSen.push((highestHigh + lowestLow) / 2);
  }
  
  // Calculate Kijun-sen (Base Line)
  for (let i = 0; i < data.length; i++) {
    if (i < 26 - 1) {
      kijunSen.push(NaN);
      continue;
    }
    
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    
    for (let j = 0; j < 26; j++) {
      const current = data[i - j];
      highestHigh = Math.max(highestHigh, current.high);
      lowestLow = Math.min(lowestLow, current.low);
    }
    
    kijunSen.push((highestHigh + lowestLow) / 2);
  }
  
  // Calculate Senkou Span A (Leading Span A)
  for (let i = 0; i < data.length; i++) {
    if (i < 26 - 1) {
      senkouSpanA.push(NaN);
      continue;
    }
    
    senkouSpanA.push((tenkanSen[i] + kijunSen[i]) / 2);
  }
  
  // Calculate Senkou Span B (Leading Span B)
  for (let i = 0; i < data.length; i++) {
    if (i < 52 - 1) {
      senkouSpanB.push(NaN);
      continue;
    }
    
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    
    for (let j = 0; j < 52; j++) {
      const current = data[i - j];
      highestHigh = Math.max(highestHigh, current.high);
      lowestLow = Math.min(lowestLow, current.low);
    }
    
    senkouSpanB.push((highestHigh + lowestLow) / 2);
  }
  
  // Calculate Chikou Span (Lagging Span)
  for (let i = 0; i < data.length; i++) {
    if (i < 26) {
      chikouSpan.push(NaN);
    } else {
      chikouSpan.push(data[i - 26].close);
    }
  }
  
  return {
    tenkanSen,
    kijunSen,
    senkouSpanA,
    senkouSpanB,
    chikouSpan,
  };
};

/**
 * Detects chart patterns in the given stock data
 * @param data Array of stock data
 * @returns Object containing detected patterns
 */
export const detectPatterns = (data: StockData[]): {
  patterns: {
    type: string;
    startIndex: number;
    endIndex: number;
    significance: number; // 0-100
  }[];
} => {
  const patterns: {
    type: string;
    startIndex: number;
    endIndex: number;
    significance: number;
  }[] = [];
  
  // Function to detect a double top pattern
  const detectDoubleTop = () => {
    const sensitivity = 0.03; // 3% tolerance
    
    for (let i = 30; i < data.length; i++) {
      // Need at least 30 bars to detect pattern
      if (i < 30) continue;
      
      // Find local maxima
      const localMaxima: number[] = [];
      
      for (let j = 5; j < 30; j++) {
        const current = data[i - j];
        
        if (
          current.high > data[i - j - 1].high &&
          current.high > data[i - j - 2].high &&
          current.high > data[i - j + 1].high &&
          current.high > data[i - j + 2].high
        ) {
          localMaxima.push(i - j);
        }
      }
      
      // Need at least 2 maxima to form a double top
      if (localMaxima.length < 2) continue;
      
      // Check for close values between the maxima (similar highs)
      for (let j = 0; j < localMaxima.length - 1; j++) {
        const firstPeak = data[localMaxima[j]];
        const secondPeak = data[localMaxima[j + 1]];
        
        // Peaks should be at least 5 bars apart
        if (localMaxima[j + 1] - localMaxima[j] < 5) continue;
        
        // Check if the peaks are close in value
        const priceDifference = Math.abs(firstPeak.high - secondPeak.high) / firstPeak.high;
        
        if (priceDifference <= sensitivity) {
          // Found a potential double top
          // Check for confirmation (price breaking below the neckline)
          const valley = Math.min(...data.slice(localMaxima[j], localMaxima[j + 1]).map(d => d.low));
          
          // Check if current price is below the valley (neckline)
          if (data[i].close < valley) {
            patterns.push({
              type: 'Double Top',
              startIndex: localMaxima[j],
              endIndex: i,
              significance: 80, // High significance
            });
            
            // Skip ahead to avoid duplicate detections
            break;
          }
        }
      }
    }
  };
  
  // Function to detect a double bottom pattern
  const detectDoubleBottom = () => {
    const sensitivity = 0.03; // 3% tolerance
    
    for (let i = 30; i < data.length; i++) {
      // Need at least 30 bars to detect pattern
      if (i < 30) continue;
      
      // Find local minima
      const localMinima: number[] = [];
      
      for (let j = 5; j < 30; j++) {
        const current = data[i - j];
        
        if (
          current.low < data[i - j - 1].low &&
          current.low < data[i - j - 2].low &&
          current.low < data[i - j + 1].low &&
          current.low < data[i - j + 2].low
        ) {
          localMinima.push(i - j);
        }
      }
      
      // Need at least 2 minima to form a double bottom
      if (localMinima.length < 2) continue;
      
      // Check for close values between the minima (similar lows)
      for (let j = 0; j < localMinima.length - 1; j++) {
        const firstBottom = data[localMinima[j]];
        const secondBottom = data[localMinima[j + 1]];
        
        // Bottoms should be at least 5 bars apart
        if (localMinima[j + 1] - localMinima[j] < 5) continue;
        
        // Check if the bottoms are close in value
        const priceDifference = Math.abs(firstBottom.low - secondBottom.low) / firstBottom.low;
        
        if (priceDifference <= sensitivity) {
          // Found a potential double bottom
          // Check for confirmation (price breaking above the neckline)
          const peak = Math.max(...data.slice(localMinima[j], localMinima[j + 1]).map(d => d.high));
          
          // Check if current price is above the peak (neckline)
          if (data[i].close > peak) {
            patterns.push({
              type: 'Double Bottom',
              startIndex: localMinima[j],
              endIndex: i,
              significance: 80, // High significance
            });
            
            // Skip ahead to avoid duplicate detections
            break;
          }
        }
      }
    }
  };
  
  // Detect head and shoulders pattern
  const detectHeadAndShoulders = () => {
    const sensitivity = 0.03; // 3% tolerance
    
    for (let i = 40; i < data.length; i++) {
      // Need at least 40 bars to detect pattern
      if (i < 40) continue;
      
      // Find local maxima
      const localMaxima: number[] = [];
      
      for (let j = 5; j < 40; j++) {
        const current = data[i - j];
        
        if (
          current.high > data[i - j - 1].high &&
          current.high > data[i - j - 2].high &&
          current.high > data[i - j + 1].high &&
          current.high > data[i - j + 2].high
        ) {
          localMaxima.push(i - j);
        }
      }
      
      // Need at least 3 maxima to form head and shoulders
      if (localMaxima.length < 3) continue;
      
      // Check for head and shoulders pattern
      for (let j = 0; j < localMaxima.length - 2; j++) {
        const leftShoulder = data[localMaxima[j]];
        const head = data[localMaxima[j + 1]];
        const rightShoulder = data[localMaxima[j + 2]];
        
        // Head should be higher than both shoulders
        if (head.high <= leftShoulder.high || head.high <= rightShoulder.high) continue;
        
        // Shoulders should be at similar heights
        const shoulderDifference = Math.abs(leftShoulder.high - rightShoulder.high) / leftShoulder.high;
        
        if (shoulderDifference <= sensitivity) {
          // Calculate neckline
          const leftTrough = Math.min(...data.slice(localMaxima[j], localMaxima[j + 1]).map(d => d.low));
          const rightTrough = Math.min(...data.slice(localMaxima[j + 1], localMaxima[j + 2]).map(d => d.low));
          
          const neckline = (leftTrough + rightTrough) / 2;
          
          // Check if current price is below neckline (confirmation)
          if (data[i].close < neckline) {
            patterns.push({
              type: 'Head and Shoulders',
              startIndex: localMaxima[j],
              endIndex: i,
              significance: 85, // Very high significance
            });
            
            // Skip ahead to avoid duplicate detections
            break;
          }
        }
      }
    }
  };
  
  // Run pattern detection functions
  detectDoubleTop();
  detectDoubleBottom();
  detectHeadAndShoulders();
  
  return { patterns };
};

/**
 * Calculate Volume Weighted Average Price (VWAP)
 * @param data Array of stock data
 * @param period Period for VWAP (default: 0 means full dataset)
 * @returns Array of VWAP values
 */
export const calculateVWAP = (data: StockData[], period: number = 0): number[] => {
  const vwapValues: number[] = [];
  let cumulativeTPV = 0; // Cumulative (Typical Price * Volume)
  let cumulativeVolume = 0; // Cumulative Volume
  
  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3;
    const volume = data[i].volume;
    
    if (period === 0) {
      // Calculate for entire dataset
      cumulativeTPV += typicalPrice * volume;
      cumulativeVolume += volume;
      vwapValues.push(cumulativeTPV / cumulativeVolume);
    } else {
      // Calculate for specific period
      if (i < period - 1) {
        cumulativeTPV += typicalPrice * volume;
        cumulativeVolume += volume;
        vwapValues.push(NaN);
      } else {
        // Reset cumulative values for each period
        if (i === period - 1) {
          cumulativeTPV = 0;
          cumulativeVolume = 0;
          
          // Calculate for current period
          for (let j = 0; j < period; j++) {
            const idx = i - j;
            const tp = (data[idx].high + data[idx].low + data[idx].close) / 3;
            const vol = data[idx].volume;
            
            cumulativeTPV += tp * vol;
            cumulativeVolume += vol;
          }
        } else {
          // Remove oldest and add newest
          const oldestIdx = i - period;
          const oldestTP = (data[oldestIdx].high + data[oldestIdx].low + data[oldestIdx].close) / 3;
          const oldestVol = data[oldestIdx].volume;
          
          cumulativeTPV -= oldestTP * oldestVol;
          cumulativeVolume -= oldestVol;
          
          cumulativeTPV += typicalPrice * volume;
          cumulativeVolume += volume;
        }
        
        vwapValues.push(cumulativeTPV / cumulativeVolume);
      }
    }
  }
  
  return vwapValues;
};