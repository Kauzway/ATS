import axios from 'axios';
import { StockData, StockDetails, StockIndicators, FnOData, TradeSetup } from '../types/stock';
import { calculateRSI, calculateADX, calculateMACD, findRSIDivergence } from '../utils/indicators';

// Base URL for our API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

/**
 * Fetches historical data for a specific stock
 */
export const fetchStockData = async (symbol: string, timeframe: string): Promise<StockData[]> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/stocks/${symbol}/data?timeframe=${timeframe}`);
    // return response.data;
    
    // For now, return mock data
    // This is a simple mock, in a real app this would be much more comprehensive
    const now = Date.now();
    const data: StockData[] = [];
    
    // Generate 100 days of mock data
    for (let i = 100; i >= 0; i--) {
      const time = now - i * 86400000; // 86400000 = 1 day in milliseconds
      const basePrice = 1000 + Math.random() * 500;
      const volatility = 10 + Math.random() * 20;
      
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      
      data.push({
        time,
        open,
        high,
        low,
        close,
        volume,
      });
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetches details for a specific stock
 */
export const fetchStockDetails = async (symbol: string): Promise<StockDetails> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/stocks/${symbol}/details`);
    // return response.data;
    
    // For now, return mock data
    return {
      symbol,
      name: symbol === 'INFY' ? 'Infosys Limited' : 
            symbol === 'TCS' ? 'Tata Consultancy Services Ltd.' : 
            symbol === 'RELIANCE' ? 'Reliance Industries Ltd.' :
            `${symbol} Corporation`,
      exchange: 'NSE',
      sector: ['INFY', 'TCS', 'WIPRO', 'TECHM'].includes(symbol) ? 'IT' :
              ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK'].includes(symbol) ? 'BANKS' :
              ['MARUTI', 'TATAMOTORS', 'HEROMOTOCO'].includes(symbol) ? 'AUTO' :
              'General',
      industry: ['INFY', 'TCS', 'WIPRO', 'TECHM'].includes(symbol) ? 'Software - Consulting' :
                ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK'].includes(symbol) ? 'Banking' :
                ['MARUTI', 'TATAMOTORS', 'HEROMOTOCO'].includes(symbol) ? 'Automobiles' :
                'General',
      currency: 'INR',
      marketCap: 5824500000000 + Math.random() * 10000000000,
      pe: 20 + Math.random() * 15,
      eps: 50 + Math.random() * 30,
      beta: 0.8 + Math.random() * 0.8,
      high52Week: 1500 + Math.random() * 500,
      low52Week: 1000 + Math.random() * 300,
      avgVolume: 3000000 + Math.random() * 5000000,
      outstandingShares: 4000000000 + Math.random() * 2000000000,
      dividendYield: 1 + Math.random() * 2,
      dividendDate: '2023-05-15',
      exDividendDate: '2023-04-15',
      description: `${symbol} is a leading company in its sector, providing high-quality products and services to its customers across the globe. The company has a strong market presence and is known for its innovative solutions.`,
      website: `https://www.${symbol.toLowerCase()}.com`,
      lotSize: 250 + Math.floor(Math.random() * 5) * 25,
      isFnO: true,
      boardLotQuantity: 1,
      weightage: 5 + Math.random() * 10,
    };
  } catch (error) {
    console.error(`Error fetching stock details for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetches technical indicators for a specific stock
 */
export const fetchStockIndicators = async (symbol: string, timeframe: string): Promise<StockIndicators> => {
  try {
    // First, we need to fetch the historical data to calculate indicators
    const stockData = await fetchStockData(symbol, timeframe);
    
    // Calculate RSI
    const rsiValues = calculateRSI(stockData, 14);
    const rsiDivergences = findRSIDivergence(stockData, rsiValues);
    
    // Calculate ADX
    const adxData = calculateADX(stockData, 14);
    
    // Calculate MACD
    const macdData = calculateMACD(stockData);
    
    // For now, return partially computed and partially mock data
    return {
      rsi: {
        value: rsiValues[rsiValues.length - 1],
        history: rsiValues,
        divergences: rsiDivergences,
      },
      adx: {
        value: adxData.adx[adxData.adx.length - 1],
        adxHistory: adxData.adx,
        diPlusHistory: adxData.diPlus,
        diMinusHistory: adxData.diMinus,
        trend: adxData.adx[adxData.adx.length - 1] > 25 ? 
              (adxData.diPlus[adxData.diPlus.length - 1] > adxData.diMinus[adxData.diMinus.length - 1] ? 'uptrend' : 'downtrend') :
              'sideways',
        strength: adxData.adx[adxData.adx.length - 1] < 20 ? 'weak' :
                 adxData.adx[adxData.adx.length - 1] < 30 ? 'moderate' :
                 adxData.adx[adxData.adx.length - 1] < 50 ? 'strong' : 'very strong',
      },
      macd: {
        value: macdData.macd[macdData.macd.length - 1],
        signal: macdData.signal[macdData.signal.length - 1],
        histogram: macdData.histogram[macdData.histogram.length - 1],
        history: macdData.macd.map((value, index) => ({
          time: stockData[index + macdData.signalPeriod - 1]?.time || 0,
          macd: value,
          signal: macdData.signal[index] || 0,
          histogram: macdData.histogram[index] || 0,
        })),
        crossovers: [], // Would be calculated in a real implementation
      },
      movingAverages: {
        sma: {
          sma20: 0, // Would be calculated in a real implementation
          sma50: 0,
          sma100: 0,
          sma200: 0,
        },
        ema: {
          ema9: 0, // Would be calculated in a real implementation
          ema20: 0,
          ema50: 0,
          ema100: 0,
          ema200: 0,
        },
        crossovers: [], // Would be calculated in a real implementation
      },
      bollingerBands: {
        upper: 0, // Would be calculated in a real implementation
        middle: 0,
        lower: 0,
        width: 0,
        percentB: 0,
        history: [], // Would be calculated in a real implementation
      },
      atr: {
        value: 0, // Would be calculated in a real implementation
        history: [], // Would be calculated in a real implementation
      },
      volumeProfile: {
        value: stockData[stockData.length - 1].volume,
        average: stockData.reduce((sum, data) => sum + data.volume, 0) / stockData.length,
        ratio: stockData[stockData.length - 1].volume / (stockData.reduce((sum, data) => sum + data.volume, 0) / stockData.length),
        trend: 'stable', // Would be calculated in a real implementation
        spikes: [], // Would be calculated in a real implementation
      },
      patterns: {
        candlestick: [], // Would be calculated in a real implementation
        chart: [], // Would be calculated in a real implementation
      },
      supports: [], // Would be calculated in a real implementation
      resistances: [], // Would be calculated in a real implementation
      pivotPoints: {
        daily: {
          r3: 0, // Would be calculated in a real implementation
          r2: 0,
          r1: 0,
          pp: 0,
          s1: 0,
          s2: 0,
          s3: 0,
        },
        weekly: {
          r3: 0, // Would be calculated in a real implementation
          r2: 0,
          r1: 0,
          pp: 0,
          s1: 0,
          s2: 0,
          s3: 0,
        },
        monthly: {
          r3: 0, // Would be calculated in a real implementation
          r2: 0,
          r1: 0,
          pp: 0,
          s1: 0,
          s2: 0,
          s3: 0,
        },
      },
      fibonacciLevels: {
        reference: {
          high: Math.max(...stockData.map(data => data.high)),
          low: Math.min(...stockData.map(data => data.low)),
        },
        levels: {
          '0': Math.min(...stockData.map(data => data.low)),
          '0.236': 0, // Would be calculated in a real implementation
          '0.382': 0,
          '0.5': 0,
          '0.618': 0,
          '0.786': 0,
          '1': Math.max(...stockData.map(data => data.high)),
        },
      },
      mlPredictions: {
        nextDay: {
          predicted: stockData[stockData.length - 1].close * (1 + (Math.random() - 0.5) * 0.02),
          confidence: 0.65 + Math.random() * 0.2,
          range: {
            lower: stockData[stockData.length - 1].close * 0.98,
            upper: stockData[stockData.length - 1].close * 1.02,
          },
        },
        nextWeek: {
          predicted: stockData[stockData.length - 1].close * (1 + (Math.random() - 0.5) * 0.05),
          confidence: 0.55 + Math.random() * 0.2,
          range: {
            lower: stockData[stockData.length - 1].close * 0.95,
            upper: stockData[stockData.length - 1].close * 1.05,
          },
        },
        trend: Math.random() > 0.5 ? 'bullish' : (Math.random() > 0.5 ? 'bearish' : 'neutral'),
        probability: 50 + Math.random() * 40,
      },
    };
  } catch (error) {
    console.error(`Error fetching stock indicators for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetches F&O data for a specific stock
 */
export const fetchStockFnOData = async (symbol: string): Promise<FnOData> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/stocks/${symbol}/fno`);
    // return response.data;
    
    // For now, return mock data
    const stockDetails = await fetchStockDetails(symbol);
    const currentPrice = 1000 + Math.random() * 1000;
    const strikes: number[] = [];
    
    // Generate strike prices around current price
    for (let i = -10; i <= 10; i++) {
      const strike = Math.round(currentPrice + i * (currentPrice * 0.025)) / 5 * 5;
      strikes.push(strike);
    }
    
    return {
      symbol,
      expiry: '2023-05-25',
      lotSize: stockDetails.lotSize,
      options: strikes.map(strike => ({
        strike,
        callPrice: Math.max(0, currentPrice - strike) + Math.random() * 50,
        callOI: Math.floor(10000 + Math.random() * 100000),
        callVolume: Math.floor(1000 + Math.random() * 10000),
        callIV: 20 + Math.random() * 30,
        putPrice: Math.max(0, strike - currentPrice) + Math.random() * 50,
        putOI: Math.floor(10000 + Math.random() * 100000),
        putVolume: Math.floor(1000 + Math.random() * 10000),
        putIV: 20 + Math.random() * 30,
      })),
      futurePremium: -10 + Math.random() * 20,
      maxPainStrike: strikes[Math.floor(strikes.length / 2)],
      pcr: 0.8 + Math.random() * 0.4,
      oiBuildup: {
        calls: Math.random() > 0.5 ? 'long' : (Math.random() > 0.5 ? 'short' : 'neutral'),
        puts: Math.random() > 0.5 ? 'long' : (Math.random() > 0.5 ? 'short' : 'neutral'),
      },
    };
  } catch (error) {
    console.error(`Error fetching F&O data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetches trade setups for a specific stock
 */
export const fetchTradeSetups = async (symbol: string): Promise<TradeSetup[]> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/stocks/${symbol}/trade-setups`);
    // return response.data;
    
    // For now, return mock data
    const stockData = await fetchStockData(symbol, 'daily');
    const currentPrice = stockData[stockData.length - 1].close;
    
    return [
      {
        symbol,
        type: 'long',
        timeframe: 'daily',
        entryPrice: currentPrice,
        stopLoss: currentPrice * 0.97,
        targets: [currentPrice * 1.03, currentPrice * 1.05, currentPrice * 1.08],
        riskRewardRatio: 3.0,
        confidence: 65,
        rationale: [
          'RSI showing bullish divergence',
          'Price above 50-day EMA',
          'Increase in trading volume',
          'Positive sector momentum',
        ],
        indicators: [
          {
            name: 'RSI',
            value: 58.24,
            interpretation: 'Neutral with bullish bias',
          },
          {
            name: 'ADX',
            value: 22.35,
            interpretation: 'Moderate trend strength',
          },
          {
            name: 'MACD',
            value: 3.08,
            interpretation: 'Positive momentum',
          },
        ],
      },
      {
        symbol,
        type: 'short',
        timeframe: 'weekly',
        entryPrice: currentPrice,
        stopLoss: currentPrice * 1.03,
        targets: [currentPrice * 0.97, currentPrice * 0.95, currentPrice * 0.92],
        riskRewardRatio: 2.5,
        confidence: 55,
        rationale: [
          'Bearish engulfing pattern on weekly chart',
          'Resistance at key Fibonacci level',
          'Overbought conditions on RSI',
          'Volume declining on rallies',
        ],
        indicators: [
          {
            name: 'RSI',
            value: 68.45,
            interpretation: 'Approaching overbought levels',
          },
          {
            name: 'ADX',
            value: 18.75,
            interpretation: 'Weak trend',
          },
          {
            name: 'MACD',
            value: -1.25,
            interpretation: 'Negative momentum building',
          },
        ],
      },
    ];
  } catch (error) {
    console.error(`Error fetching trade setups for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetches stocks by sector
 */
export const fetchStocksBySector = async (sector: string): Promise<string[]> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/sectors/${sector}/stocks`);
    // return response.data;
    
    // For now, return mock data
    switch (sector) {
      case 'IT':
        return ['INFY', 'TCS', 'WIPRO', 'TECHM', 'HCLTECH', 'MPHASIS', 'MINDTREE', 'LTTS'];
      case 'BANKS':
        return ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK', 'INDUSINDBK', 'BANDHANBNK', 'FEDERALBNK'];
      case 'AUTO':
        return ['MARUTI', 'TATAMOTORS', 'HEROMOTOCO', 'BAJAJ-AUTO', 'EICHERMOT', 'TVSMOTOR', 'ASHOKLEY', 'MOTHERSON'];
      case 'PHARMA':
        return ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'BIOCON', 'AUROPHARMA', 'LUPIN', 'TORNTPHARM'];
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching stocks by sector ${sector}:`, error);
    throw error;
  }
};