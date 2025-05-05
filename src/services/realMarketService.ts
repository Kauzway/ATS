import { get } from './apiClient';
import { MarketData, SectorData, StockData } from '../types/market';
import { niftyIndices } from '../data/niftyIndices';

// Define API endpoints
const ENDPOINTS = {
  MARKET_OVERVIEW: '/market/overview',
  SECTOR_PERFORMANCE: '/market/sectors',
  TOP_STOCKS: '/market/top-stocks',
  INDICES: '/market/indices',
  MARKET_BREADTH: '/market/breadth',
  MARKET_HEATMAP: '/market/heatmap',
};

/**
 * Fetches market overview data for a specific index and timeframe
 */
export const fetchMarketOverview = async (
  index: string, 
  timeframe: string
): Promise<MarketData> => {
  try {
    return await get<MarketData>(
      ENDPOINTS.MARKET_OVERVIEW,
      { index, timeframe }
    );
  } catch (error) {
    console.error('Error fetching market overview:', error);
    
    // Check if we should use mock data as fallback
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.warn('Using mock data for market overview');
      // Import mock data dynamically to avoid bundling it in production
      const { fetchMarketOverview } = await import('./marketService');
      return fetchMarketOverview(index, timeframe);
    }
    
    throw error;
  }
};

/**
 * Fetches sector performance data
 */
export const fetchSectorPerformance = async (
  timeframe: string
): Promise<SectorData[]> => {
  try {
    return await get<SectorData[]>(
      ENDPOINTS.SECTOR_PERFORMANCE,
      { timeframe }
    );
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    
    // Check if we should use mock data as fallback
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.warn('Using mock data for sector performance');
      // Import mock data dynamically to avoid bundling it in production
      const { fetchSectorPerformance } = await import('./marketService');
      return fetchSectorPerformance(timeframe);
    }
    
    throw error;
  }
};

/**
 * Fetches top performing stocks
 */
export const fetchTopPerformingStocks = async (
  count: number, 
  sortBy: string
): Promise<StockData[]> => {
  try {
    return await get<StockData[]>(
      ENDPOINTS.TOP_STOCKS,
      { count, sortBy }
    );
  } catch (error) {
    console.error('Error fetching top performing stocks:', error);
    
    // Check if we should use mock data as fallback
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.warn('Using mock data for top performing stocks');
      // Import mock data dynamically to avoid bundling it in production
      const { fetchTopPerformingStocks } = await import('./marketService');
      return fetchTopPerformingStocks(count, sortBy);
    }
    
    throw error;
  }
};

/**
 * Fetches all available Nifty indices
 */
export const fetchNiftyIndices = async (): Promise<string[]> => {
  try {
    return await get<string[]>(ENDPOINTS.INDICES);
  } catch (error) {
    console.error('Error fetching Nifty indices:', error);
    
    // For indices, we can always fall back to our local data
    console.warn('Using local data for Nifty indices');
    return niftyIndices;
  }
};

/**
 * Fetches market breadth for a specific index
 */
export const fetchMarketBreadth = async (
  index: string
): Promise<{
  advancing: number;
  declining: number;
  unchanged: number;
  total: number;
}> => {
  try {
    return await get<{
      advancing: number;
      declining: number;
      unchanged: number;
      total: number;
    }>(
      ENDPOINTS.MARKET_BREADTH,
      { index }
    );
  } catch (error) {
    console.error('Error fetching market breadth:', error);
    
    // Check if we should use mock data as fallback
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.warn('Using mock data for market breadth');
      // Import mock data dynamically to avoid bundling it in production
      const { fetchMarketBreadth } = await import('./marketService');
      return fetchMarketBreadth(index);
    }
    
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
    return await get<{
      sectors: {
        name: string;
        change: number;
        stocks: { symbol: string; change: number }[];
      }[];
    }>(ENDPOINTS.MARKET_HEATMAP);
  } catch (error) {
    console.error('Error fetching market heatmap:', error);
    
    // Check if we should use mock data as fallback
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.warn('Using mock data for market heatmap');
      // Import mock data dynamically to avoid bundling it in production
      const { fetchMarketHeatmap } = await import('./marketService');
      return fetchMarketHeatmap();
    }
    
    throw error;
  }
};