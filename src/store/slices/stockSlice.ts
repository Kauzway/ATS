import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStockData, fetchStockDetails, fetchStockIndicators } from '../../services/stockService';
import { StockData, StockDetails, StockIndicators } from '../../types/stock';

interface StockState {
  currentStock: string | null;
  stockData: Record<string, StockData[]>;
  stockDetails: Record<string, StockDetails>;
  stockIndicators: Record<string, StockIndicators>;
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  currentStock: null,
  stockData: {},
  stockDetails: {},
  stockIndicators: {},
  loading: false,
  error: null,
};

export const fetchStock = createAsyncThunk(
  'stock/fetchStock',
  async ({ 
    symbol, 
    timeframe 
  }: { 
    symbol: string; 
    timeframe: string 
  }, { rejectWithValue }) => {
    try {
      const data = await fetchStockData(symbol, timeframe);
      return { symbol, data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchDetails = createAsyncThunk(
  'stock/fetchDetails',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const data = await fetchStockDetails(symbol);
      return { symbol, data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchIndicators = createAsyncThunk(
  'stock/fetchIndicators',
  async ({ 
    symbol, 
    timeframe 
  }: { 
    symbol: string; 
    timeframe: string 
  }, { rejectWithValue }) => {
    try {
      const data = await fetchStockIndicators(symbol, timeframe);
      return { symbol, data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setCurrentStock: (state, action) => {
      state.currentStock = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stock data
      .addCase(fetchStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.loading = false;
        const { symbol, data } = action.payload;
        state.stockData[symbol] = data;
        state.currentStock = symbol;
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch stock details
      .addCase(fetchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetails.fulfilled, (state, action) => {
        state.loading = false;
        const { symbol, data } = action.payload;
        state.stockDetails[symbol] = data;
      })
      .addCase(fetchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch stock indicators
      .addCase(fetchIndicators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndicators.fulfilled, (state, action) => {
        state.loading = false;
        const { symbol, data } = action.payload;
        state.stockIndicators[symbol] = data;
      })
      .addCase(fetchIndicators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentStock } = stockSlice.actions;

export default stockSlice.reducer;