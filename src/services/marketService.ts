import axios from 'axios';
import { MarketData, SectorData, StockData } from '../types/market';
import { niftyIndices } from '../data/niftyIndices';

// Base URL for our API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

/**
 * Fetches market overview data for a specific index and timeframe
 */
export const fetchMarketOverview = async (index: string, timeframe: string): Promise<MarketData> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/market/overview?index=${index}&timeframe=${timeframe}`);
    // return response.data;
    
    // For now, return mock data
    return {
      index,
      timestamp: Date.now(),
      open: 22045.25,
      high: 22156.65,
      low: 21992.10,
      close: 22120.35,
      volume: 254689755,
      previousClose: 22015.70,
      change: 104.65,
      changePercent: 0.48,
      dayRange: {
        low: 21992.10,
        high: 22156.65,
      },
      yearRange: {
        low: 16828.35,
        high: 22185.70,
      },
      marketCap: 39582648500000,
      pe: 23.56,
      pb: 3.75,
      divYield: 1.23,
      technicalIndicators: {
        rsi: 58.24,
        adx: 22.35,
        macd: {
          macd: 45.23,
          signal: 42.15,
          histogram: 3.08,
        },
        sma: {
          sma20: 21856.45,
          sma50: 21254.30,
          sma200: 20125.80,
        },
        ema: {
          ema20: 21912.35,
          ema50: 21325.75,
          ema200: 20245.65,
        },
        bbands: {
          upper: 22456.30,
          middle: 21856.45,
          lower: 21256.60,
        },
        atr: 245.30,
      },
      breadth: {
        advancing: 32,
        declining: 18,
        unchanged: 0,
        total: 50,
        advancingVolume: 154862355,
        decliningVolume: 99827400,
      },
      sentiment: {
        bullish: 65,
        bearish: 25,
        neutral: 10,
      },
      historicalData: [
        {
          time: Date.now() - 86400000 * 5,
          open: 21845.25,
          high: 21956.65,
          low: 21792.10,
          close: 21920.35,
          volume: 234689755,
        },
        {
          time: Date.now() - 86400000 * 4,
          open: 21920.35,
          high: 22056.65,
          low: 21892.10,
          close: 22015.70,
          volume: 244689755,
        },
        {
          time: Date.now() - 86400000 * 3,
          open: 22015.70,
          high: 22125.65,
          low: 21915.10,
          close: 22045.25,
          volume: 224689755,
        },
        {
          time: Date.now() - 86400000 * 2,
          open: 22045.25,
          high: 22145.65,
          low: 21975.10,
          close: 22095.35,
          volume: 214689755,
        },
        {
          time: Date.now() - 86400000,
          open: 22095.35,
          high: 22156.65,
          low: 22015.10,
          close: 22015.70,
          volume: 204689755,
        },
        {
          time: Date.now(),
          open: 22045.25,
          high: 22156.65,
          low: 21992.10,
          close: 22120.35,
          volume: 254689755,
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching market overview:', error);
    throw error;
  }
};

/**
 * Fetches sector performance data
 */
export const fetchSectorPerformance = async (timeframe: string): Promise<SectorData[]> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/market/sectors?timeframe=${timeframe}`);
    // return response.data;
    
    // For now, return mock data
    return [
      {
        name: 'NIFTY IT',
        change: 1.75,
        changePercent: 2.32,
        marketCap: 9582648500000,
        volume: 54689755,
        pe: 28.45,
        technicalIndicators: {
          rsi: 62.35,
          adx: 24.75,
          trend: 'uptrend',
        },
        topGainers: [
          {
            symbol: 'INFY',
            name: 'Infosys Ltd',
            change: 45.25,
            changePercent: 3.25,
          },
          {
            symbol: 'TCS',
            name: 'Tata Consultancy Services Ltd',
            change: 85.65,
            changePercent: 2.15,
          },
        ],
        topLosers: [
          {
            symbol: 'TECHM',
            name: 'Tech Mahindra Ltd',
            change: -15.35,
            changePercent: -1.35,
          },
        ],
        historicalPerformance: {
          day: 2.32,
          week: 3.45,
          month: 5.24,
          threeMonths: 8.56,
          sixMonths: 12.35,
          year: 18.65,
          threeYears: 45.75,
          fiveYears: 65.25,
        },
      },
      {
        name: 'NIFTY BANK',
        change: 0.85,
        changePercent: 0.65,
        marketCap: 12582648500000,
        volume: 34689755,
        pe: 22.15,
        technicalIndicators: {
          rsi: 54.25,
          adx: 18.45,
          trend: 'sideways',
        },
        topGainers: [
          {
            symbol: 'HDFCBANK',
            name: 'HDFC Bank Ltd',
            change: 22.45,
            changePercent: 1.25,
          },
        ],
        topLosers: [
          {
            symbol: 'AXISBANK',
            name: 'Axis Bank Ltd',
            change: -8.75,
            changePercent: -0.65,
          },
        ],
        historicalPerformance: {
          day: 0.65,
          week: 1.25,
          month: 2.45,
          threeMonths: 4.85,
          sixMonths: 8.65,
          year: 12.45,
          threeYears: 28.65,
          fiveYears: 42.35,
        },
      },
      {
        name: 'NIFTY AUTO',
        change: -0.45,
        changePercent: -0.32,
        marketCap: 8582648500000,
        volume: 24689755,
        pe: 25.35,
        technicalIndicators: {
          rsi: 48.25,
          adx: 14.35,
          trend: 'sideways',
        },
        topGainers: [
          {
            symbol: 'MARUTI',
            name: 'Maruti Suzuki India Ltd',
            change: 35.45,
            changePercent: 0.85,
          },
        ],
        topLosers: [
          {
            symbol: 'TVSMOTOR',
            name: 'TVS Motor Company Ltd',
            change: -12.35,
            changePercent: -1.15,
          },
          {
            symbol: 'TATAMOTORS',
            name: 'Tata Motors Ltd',
            change: -8.45,
            changePercent: -0.95,
          },
        ],
        historicalPerformance: {
          day: -0.32,
          week: 0.45,
          month: 1.25,
          threeMonths: 3.45,
          sixMonths: 6.85,
          year: 14.25,
          threeYears: 32.45,
          fiveYears: 48.65,
        },
      },
    ];
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    throw error;
  }
};

/**
 * Fetches top performing stocks
 */
export const fetchTopPerformingStocks = async (count: number, sortBy: string): Promise<StockData[]> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/market/top-stocks?count=${count}&sortBy=${sortBy}`);
    // return response.data;
    
    // For now, return mock data
    return [
      {
        symbol: 'INFY',
        name: 'Infosys Ltd',
        sector: 'IT',
        price: 1435.65,
        change: 45.25,
        changePercent: 3.25,
        volume: 4568975,
        marketCap: 5824500000000,
        pe: 28.45,
        technicalIndicators: {
          rsi: 62.35,
          adx: 24.75,
          trend: 'uptrend',
        },
        historicalPerformance: {
          day: 3.25,
          week: 4.85,
          month: 6.45,
          threeMonths: 9.85,
          sixMonths: 15.45,
          year: 24.85,
        },
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd',
        sector: 'IT',
        price: 4085.75,
        change: 85.65,
        changePercent: 2.15,
        volume: 2568975,
        marketCap: 14824500000000,
        pe: 32.15,
        technicalIndicators: {
          rsi: 58.45,
          adx: 22.35,
          trend: 'uptrend',
        },
        historicalPerformance: {
          day: 2.15,
          week: 3.45,
          month: 5.85,
          threeMonths: 8.45,
          sixMonths: 12.85,
          year: 18.45,
        },
      },
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        sector: 'BANKS',
        price: 1795.45,
        change: 22.45,
        changePercent: 1.25,
        volume: 5689754,
        marketCap: 10245600000000,
        pe: 22.45,
        technicalIndicators: {
          rsi: 54.25,
          adx: 18.45,
          trend: 'sideways',
        },
        historicalPerformance: {
          day: 1.25,
          week: 2.45,
          month: 3.85,
          threeMonths: 5.45,
          sixMonths: 9.85,
          year: 14.45,
        },
      },
      {
        symbol: 'MARUTI',
        name: 'Maruti Suzuki India Ltd',
        sector: 'AUTO',
        price: 4235.25,
        change: 35.45,
        changePercent: 0.85,
        volume: 1258975,
        marketCap: 1258900000000,
        pe: 25.85,
        technicalIndicators: {
          rsi: 52.15,
          adx: 16.45,
          trend: 'sideways',
        },
        historicalPerformance: {
          day: 0.85,
          week: 1.45,
          month: 2.85,
          threeMonths: 4.45,
          sixMonths: 8.25,
          year: 16.45,
        },
      },
    ].slice(0, count);
  } catch (error) {
    console.error('Error fetching top performing stocks:', error);
    throw error;
  }
};

/**
 * Fetches all available Nifty indices
 */
export const fetchNiftyIndices = async (): Promise<string[]> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/market/indices`);
    // return response.data;
    
    // For now, return from local data
    return niftyIndices;
  } catch (error) {
    console.error('Error fetching Nifty indices:', error);
    throw error;
  }
};

/**
 * Fetches market breadth for a specific index
 */
export const fetchMarketBreadth = async (index: string): Promise<{
  advancing: number;
  declining: number;
  unchanged: number;
  total: number;
}> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/market/breadth?index=${index}`);
    // return response.data;
    
    // For now, return mock data
    return {
      advancing: 32,
      declining: 18,
      unchanged: 0,
      total: 50,
    };
  } catch (error) {
    console.error('Error fetching market breadth:', error);
    throw error;
  }
};

/**
 * Fetches market heatmap
 */
export const fetchMarketHeatmap = async (): Promise<{
  sectors: {
    name: string;
    change: number;
    stocks: { symbol: string; change: number }[];
  }[];
}> => {
  try {
    // Implement when API is available
    // const response = await axios.get(`${API_BASE_URL}/market/heatmap`);
    // return response.data;
    
    // For now, return mock data
    return {
      sectors: [
        {
          name: 'IT',
          change: 1.75,
          stocks: [
            { symbol: 'INFY', change: 3.25 },
            { symbol: 'TCS', change: 2.15 },
            { symbol: 'WIPRO', change: 1.85 },
            { symbol: 'TECHM', change: -1.35 },
            { symbol: 'HCLTECH', change: 1.45 },
          ],
        },
        {
          name: 'BANKS',
          change: 0.65,
          stocks: [
            { symbol: 'HDFCBANK', change: 1.25 },
            { symbol: 'ICICIBANK', change: 0.85 },
            { symbol: 'SBIN', change: 0.45 },
            { symbol: 'AXISBANK', change: -0.65 },
            { symbol: 'KOTAKBANK', change: 0.75 },
          ],
        },
        {
          name: 'AUTO',
          change: -0.32,
          stocks: [
            { symbol: 'MARUTI', change: 0.85 },
            { symbol: 'TVSMOTOR', change: -1.15 },
            { symbol: 'TATAMOTORS', change: -0.95 },
            { symbol: 'HEROMOTOCO', change: 0.25 },
            { symbol: 'BAJAJ-AUTO', change: 0.35 },
          ],
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching market heatmap:', error);
    throw error;
  }
};