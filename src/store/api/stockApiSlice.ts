import { apiSlice } from './apiSlice';
import { StockData, StockDetails, StockIndicators } from '../../types/stock';

export const stockApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.query<StockData[], { symbol: string; timeframe: string }>({
      query: ({ symbol, timeframe }) => `/stocks/${symbol}/data?timeframe=${timeframe}`,
      providesTags: (result, error, { symbol }) => [{ type: 'Stock', id: `${symbol}-data` }],
    }),
    
    getStockDetails: builder.query<StockDetails, string>({
      query: (symbol) => `/stocks/${symbol}/details`,
      providesTags: (result, error, symbol) => [{ type: 'Stock', id: `${symbol}-details` }],
    }),
    
    getStockIndicators: builder.query<StockIndicators, { symbol: string; timeframe: string }>({
      query: ({ symbol, timeframe }) => `/stocks/${symbol}/indicators?timeframe=${timeframe}`,
      providesTags: (result, error, { symbol }) => [{ type: 'Stock', id: `${symbol}-indicators` }],
    }),
    
    getStocksByIndex: builder.query<string[], string>({
      query: (index) => `/indices/${index}/stocks`,
      providesTags: (result, error, index) => [{ type: 'Index', id: index }],
    }),
    
    getStockRSI: builder.query<number[], { symbol: string; period: number; timeframe: string }>({
      query: ({ symbol, period, timeframe }) => 
        `/stocks/${symbol}/indicators/rsi?period=${period}&timeframe=${timeframe}`,
      providesTags: (result, error, { symbol }) => [{ type: 'Stock', id: `${symbol}-rsi` }],
    }),
    
    getStockADX: builder.query<{
      adx: number[];
      diPlus: number[];
      diMinus: number[];
    }, { symbol: string; period: number; timeframe: string }>({
      query: ({ symbol, period, timeframe }) => 
        `/stocks/${symbol}/indicators/adx?period=${period}&timeframe=${timeframe}`,
      providesTags: (result, error, { symbol }) => [{ type: 'Stock', id: `${symbol}-adx` }],
    }),
    
    getStockVolatility: builder.query<number, { symbol: string; days: number }>({
      query: ({ symbol, days }) => `/stocks/${symbol}/volatility?days=${days}`,
      providesTags: (result, error, { symbol }) => [{ type: 'Stock', id: `${symbol}-volatility` }],
    }),
  }),
});

export const {
  useGetStockDataQuery,
  useGetStockDetailsQuery,
  useGetStockIndicatorsQuery,
  useGetStocksByIndexQuery,
  useGetStockRSIQuery,
  useGetStockADXQuery,
  useGetStockVolatilityQuery,
} = stockApiSlice;