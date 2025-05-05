import { StockData } from '../types/stock';

/**
 * Calculates the Relative Strength Index (RSI) for the given stock data
 * @param data Array of stock data
 * @param period RSI period (default: 14)
 * @returns Array of RSI values
 */
export const calculateRSI = (data: StockData[], period: number = 14): number[] => {
  if (data.length <= period) {
    return Array(data.length).fill(50);
  }

  const rsiValues: number[] = [];
  let gains = 0;
  let losses = 0;

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculate RSI for the first period
  let rs = avgGain / avgLoss;
  let rsi = 100 - (100 / (1 + rs));
  rsiValues.push(rsi);

  // Calculate RSI for the rest of the data
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    let currentGain = 0;
    let currentLoss = 0;

    if (change >= 0) {
      currentGain = change;
    } else {
      currentLoss = -change;
    }

    // Use Wilder's smoothing method
    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    rs = avgGain / avgLoss;
    rsi = 100 - (100 / (1 + rs));
    rsiValues.push(rsi);
  }

  // Fill the beginning of the array with NaN to match the length of the input data
  const fillerArray = Array(period).fill(NaN);
  return [...fillerArray, ...rsiValues];
};

/**
 * Calculates the Average Directional Index (ADX) for the given stock data
 * @param data Array of stock data
 * @param period ADX period (default: 14)
 * @returns Object containing ADX, +DI, and -DI arrays
 */
export const calculateADX = (data: StockData[], period: number = 14): {
  adx: number[];
  diPlus: number[];
  diMinus: number[];
} => {
  if (data.length <= period + 1) {
    return {
      adx: Array(data.length).fill(25),
      diPlus: Array(data.length).fill(25),
      diMinus: Array(data.length).fill(25),
    };
  }

  const trueRanges: number[] = [];
  const directionalMovementPlus: number[] = [];
  const directionalMovementMinus: number[] = [];

  // Calculate True Range and Directional Movement
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevHigh = data[i - 1].high;
    const prevLow = data[i - 1].low;
    const prevClose = data[i - 1].close;

    // True Range
    const tr1 = high - low;
    const tr2 = Math.abs(high - prevClose);
    const tr3 = Math.abs(low - prevClose);
    const tr = Math.max(tr1, tr2, tr3);
    trueRanges.push(tr);

    // Directional Movement
    const dmPlus = high > prevHigh ? Math.max(high - prevHigh, 0) : 0;
    const dmMinus = prevLow > low ? Math.max(prevLow - low, 0) : 0;

    directionalMovementPlus.push(dmPlus);
    directionalMovementMinus.push(dmMinus);
  }

  // Calculate smoothed TR, +DM, and -DM for first period
  let smoothedTR = trueRanges.slice(0, period).reduce((sum, value) => sum + value, 0);
  let smoothedDMPlus = directionalMovementPlus.slice(0, period).reduce((sum, value) => sum + value, 0);
  let smoothedDMMinus = directionalMovementMinus.slice(0, period).reduce((sum, value) => sum + value, 0);

  const diPlus: number[] = [];
  const diMinus: number[] = [];
  const dx: number[] = [];

  // Calculate +DI and -DI for the first period
  let diPlusValue = (smoothedDMPlus / smoothedTR) * 100;
  let diMinusValue = (smoothedDMMinus / smoothedTR) * 100;
  diPlus.push(diPlusValue);
  diMinus.push(diMinusValue);

  // Calculate DX for the first period
  const dxValue = (Math.abs(diPlusValue - diMinusValue) / (diPlusValue + diMinusValue)) * 100;
  dx.push(dxValue);

  // Calculate +DI, -DI, and DX for the rest of the data
  for (let i = period; i < trueRanges.length; i++) {
    // Wilder's smoothing method
    smoothedTR = smoothedTR - (smoothedTR / period) + trueRanges[i];
    smoothedDMPlus = smoothedDMPlus - (smoothedDMPlus / period) + directionalMovementPlus[i];
    smoothedDMMinus = smoothedDMMinus - (smoothedDMMinus / period) + directionalMovementMinus[i];

    diPlusValue = (smoothedDMPlus / smoothedTR) * 100;
    diMinusValue = (smoothedDMMinus / smoothedTR) * 100;
    diPlus.push(diPlusValue);
    diMinus.push(diMinusValue);

    const currentDX = (Math.abs(diPlusValue - diMinusValue) / (diPlusValue + diMinusValue)) * 100;
    dx.push(currentDX);
  }

  // Calculate ADX
  const adx: number[] = [];
  let adxSum = dx.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  adx.push(adxSum);

  for (let i = 1; i < dx.length - period + 1; i++) {
    adxSum = ((adxSum * (period - 1)) + dx[i + period - 1]) / period;
    adx.push(adxSum);
  }

  // Fill the beginning of the array with NaN to match the length of the input data
  const fillerArray = Array(period + 1).fill(NaN);
  
  const fullDiPlus = [...fillerArray, ...diPlus];
  const fullDiMinus = [...fillerArray, ...diMinus];
  const fullAdx = [...fillerArray, ...adx];

  // Truncate to match the length of the input data if necessary
  return {
    adx: fullAdx.slice(0, data.length),
    diPlus: fullDiPlus.slice(0, data.length),
    diMinus: fullDiMinus.slice(0, data.length),
  };
};

/**
 * Calculates the Moving Average Convergence Divergence (MACD) for the given stock data
 * @param data Array of stock data
 * @param fastPeriod Fast EMA period (default: 12)
 * @param slowPeriod Slow EMA period (default: 26)
 * @param signalPeriod Signal EMA period (default: 9)
 * @returns Object containing MACD, signal, and histogram arrays
 */
export const calculateMACD = (
  data: StockData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): {
  macd: number[];
  signal: number[];
  histogram: number[];
  signalPeriod: number;
} => {
  // Extract closing prices
  const closePrices = data.map(d => d.close);
  
  // Calculate fast EMA
  const fastEMA = calculateEMA(closePrices, fastPeriod);
  
  // Calculate slow EMA
  const slowEMA = calculateEMA(closePrices, slowPeriod);
  
  // Calculate MACD line
  const macdLine: number[] = [];
  for (let i = 0; i < closePrices.length; i++) {
    if (i < slowPeriod - 1) {
      macdLine.push(NaN);
    } else {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }
  }
  
  // Calculate signal line
  const validMacd = macdLine.slice(slowPeriod - 1);
  const signalLine = calculateEMA(validMacd, signalPeriod);
  
  // Fill the beginning of the signal array with NaN
  const fullSignalLine = [
    ...Array(slowPeriod - 1).fill(NaN),
    ...Array(signalPeriod - 1).fill(NaN),
    ...signalLine
  ];
  
  // Calculate histogram
  const histogram: number[] = [];
  for (let i = 0; i < macdLine.length; i++) {
    if (i < slowPeriod + signalPeriod - 2) {
      histogram.push(NaN);
    } else {
      histogram.push(macdLine[i] - fullSignalLine[i]);
    }
  }
  
  return {
    macd: macdLine,
    signal: fullSignalLine.slice(0, macdLine.length),
    histogram,
    signalPeriod
  };
};

/**
 * Calculates Exponential Moving Average (EMA)
 * @param data Array of values
 * @param period EMA period
 * @returns Array of EMA values
 */
export const calculateEMA = (data: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  
  ema.push(sum / period);
  
  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    ema.push(data[i] * multiplier + ema[ema.length - 1] * (1 - multiplier));
  }
  
  // Fill the beginning of the array with NaN
  const result = Array(period - 1).fill(NaN).concat(ema);
  
  return result;
};

/**
 * Calculates Simple Moving Average (SMA)
 * @param data Array of values
 * @param period SMA period
 * @returns Array of SMA values
 */
export const calculateSMA = (data: number[], period: number): number[] => {
  const sma: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    
    sma.push(sum / period);
  }
  
  return sma;
};

/**
 * Finds RSI divergences (bullish and bearish) in the given stock data
 * @param data Array of stock data
 * @param rsiValues Array of RSI values
 * @returns Object containing bullish and bearish divergences
 */
export const findRSIDivergence = (data: StockData[], rsiValues: number[]): {
  bullish: { time: number; price: number; rsi: number }[];
  bearish: { time: number; price: number; rsi: number }[];
} => {
  const bullishDivergences: { time: number; price: number; rsi: number }[] = [];
  const bearishDivergences: { time: number; price: number; rsi: number }[] = [];
  
  // Find local minima and maxima in price
  const priceMinima: number[] = [];
  const priceMaxima: number[] = [];
  
  for (let i = 2; i < data.length - 2; i++) {
    // Check for price minima
    if (
      data[i].low < data[i - 1].low &&
      data[i].low < data[i - 2].low &&
      data[i].low < data[i + 1].low &&
      data[i].low < data[i + 2].low
    ) {
      priceMinima.push(i);
    }
    
    // Check for price maxima
    if (
      data[i].high > data[i - 1].high &&
      data[i].high > data[i - 2].high &&
      data[i].high > data[i + 1].high &&
      data[i].high > data[i + 2].high
    ) {
      priceMaxima.push(i);
    }
  }
  
  // Check for bullish divergence (price makes lower low, RSI makes higher low)
  for (let i = 0; i < priceMinima.length - 1; i++) {
    const index1 = priceMinima[i];
    const index2 = priceMinima[i + 1];
    
    if (
      data[index2].low < data[index1].low && // Price made lower low
      rsiValues[index2] > rsiValues[index1] && // RSI made higher low
      !isNaN(rsiValues[index1]) && !isNaN(rsiValues[index2]) // RSI values are valid
    ) {
      bullishDivergences.push({
        time: data[index2].time,
        price: data[index2].low,
        rsi: rsiValues[index2],
      });
    }
  }
  
  // Check for bearish divergence (price makes higher high, RSI makes lower high)
  for (let i = 0; i < priceMaxima.length - 1; i++) {
    const index1 = priceMaxima[i];
    const index2 = priceMaxima[i + 1];
    
    if (
      data[index2].high > data[index1].high && // Price made higher high
      rsiValues[index2] < rsiValues[index1] && // RSI made lower high
      !isNaN(rsiValues[index1]) && !isNaN(rsiValues[index2]) // RSI values are valid
    ) {
      bearishDivergences.push({
        time: data[index2].time,
        price: data[index2].high,
        rsi: rsiValues[index2],
      });
    }
  }
  
  return {
    bullish: bullishDivergences,
    bearish: bearishDivergences,
  };
};

/**
 * Calculates Bollinger Bands
 * @param data Array of values
 * @param period Period for SMA (default: 20)
 * @param multiplier Standard deviation multiplier (default: 2)
 * @returns Object containing upper, middle, and lower band arrays
 */
export const calculateBollingerBands = (
  data: number[],
  period: number = 20,
  multiplier: number = 2
): {
  upper: number[];
  middle: number[];
  lower: number[];
} => {
  // Calculate middle band (SMA)
  const middleBand = calculateSMA(data, period);
  
  const upperBand: number[] = [];
  const lowerBand: number[] = [];
  
  // Calculate upper and lower bands
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upperBand.push(NaN);
      lowerBand.push(NaN);
      continue;
    }
    
    // Calculate standard deviation
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(data[i - j] - middleBand[i], 2);
    }
    
    const stdDev = Math.sqrt(sum / period);
    
    upperBand.push(middleBand[i] + multiplier * stdDev);
    lowerBand.push(middleBand[i] - multiplier * stdDev);
  }
  
  return {
    upper: upperBand,
    middle: middleBand,
    lower: lowerBand,
  };
};

/**
 * Calculates Average True Range (ATR)
 * @param data Array of stock data
 * @param period Period for ATR (default: 14)
 * @returns Array of ATR values
 */
export const calculateATR = (data: StockData[], period: number = 14): number[] => {
  const trueRanges: number[] = [];
  
  // Calculate True Range
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;
    
    const tr1 = high - low;
    const tr2 = Math.abs(high - prevClose);
    const tr3 = Math.abs(low - prevClose);
    
    const tr = Math.max(tr1, tr2, tr3);
    trueRanges.push(tr);
  }
  
  // Calculate ATR
  const atr: number[] = [];
  
  // First ATR is the average of the first 'period' true ranges
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += trueRanges[i];
  }
  
  atr.push(sum / period);
  
  // Calculate the rest using Wilder's smoothing method
  for (let i = period; i < trueRanges.length; i++) {
    atr.push((atr[atr.length - 1] * (period - 1) + trueRanges[i]) / period);
  }
  
  // Fill the beginning of the array with NaN
  const result = [NaN, ...Array(period - 1).fill(NaN), ...atr];
  
  return result.slice(0, data.length);
};