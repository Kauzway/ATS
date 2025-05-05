import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchMarketOverview, 
  fetchSectorPerformance, 
  fetchTopPerformingStocks 
} from '../../services/marketService';
import { MarketData, SectorData, StockData } from '../../types/market';

interface MarketState {
  marketData: MarketData | null;
  sectorData: SectorData[];
  topStocks: StockData[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  marketData: null,
  sectorData: [],
  topStocks: [],
  loading: false,
  error: null,
};

export const fetchMarketData = createAsyncThunk(
  'market/fetchMarketData',
  async ({ index, timeframe }: { index: string; timeframe: string }, { rejectWithValue }) => {
    try {
      const data = await fetchMarketOverview(index, timeframe);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchSectorData = createAsyncThunk(
  'market/fetchSectorData',
  async ({ timeframe }: { timeframe: string }, { rejectWithValue }) => {
    try {
      const data = await fetchSectorPerformance(timeframe);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchTopStocks = createAsyncThunk(
  'market/fetchTopStocks',
  async ({ count, sortBy }: { count: number; sortBy: string }, { rejectWithValue }) => {
    try {
      const data = await fetchTopPerformingStocks(count, sortBy);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch market data
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.marketData = action.payload;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch sector data
      .addCase(fetchSectorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectorData.fulfilled, (state, action) => {
        state.loading = false;
        state.sectorData = action.payload;
      })
      .addCase(fetchSectorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch top stocks
      .addCase(fetchTopStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.topStocks = action.payload;
      })
      .addCase(fetchTopStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });