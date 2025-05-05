import { apiSlice } from './apiSlice';
import { MarketData, SectorData, StockData } from '../../types/market';

export const marketApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMarketOverview: builder.query<MarketData, { index: string; timeframe: string }>({
      query: ({ index, timeframe }) => `/market/overview?index=${index}&timeframe=${timeframe}`,
      providesTags: (result, error, { index }) => [{ type: 'Index', id: `${index}-overview` }],
    }),
    
    getSectorPerformance: builder.query<SectorData[], string>({
      query: (timeframe) => `/market/sectors?timeframe=${timeframe}`,
      providesTags: ['Sector'],
    }),
    
    getTopPerformingStocks: builder.query<StockData[], { count: number; sortBy: string }>({
      query: ({ count, sortBy }) => `/market/top-stocks?count=${count}&sortBy=${sortBy}`,
      providesTags: ['Stock'],
    }),
    
    getNiftyIndices: builder.query<string[], void>({
      query: () => '/market/indices',
      providesTags: ['Index'],
    }),
    
    getMarketBreadth: builder.query<{
      advancing: number;
      declining: number;
      unchanged: number;
      total: number;
    }, { index: string }>({
      query: ({ index }) => `/market/breadth?index=${index}`,
      providesTags: (result, error, { index }) => [{ type: 'Index', id: `${index}-breadth` }],
    }),
    
    getMarketHeatmap: builder.query<{
      sectors: {
        name: string;
        change: number;
        stocks: { symbol: string; change: number }[];
      }[];
    }, void>({
      query: () => '/market/heatmap',
      providesTags: ['Sector'],
    }),
  }),
});

export const {
  useGetMarketOverviewQuery,
  useGetSectorPerformanceQuery,
  useGetTopPerformingStocksQuery,
  useGetNiftyIndicesQuery,
  useGetMarketBreadthQuery,
  useGetMarketHeatmapQuery,
} = marketApiSlice;