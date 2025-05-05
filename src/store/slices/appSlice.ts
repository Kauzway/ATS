import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNiftyIndices } from '../../services/marketService';

interface AppState {
  initialized: boolean;
  indices: string[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  initialized: false,
  indices: [],
  loading: false,
  error: null,
};

export const initializeApp = createAsyncThunk(
  'app/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch available Nifty indices
      const indices = await fetchNiftyIndices();
      return { indices };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.indices = action.payload.indices;
      })
      .addCase(initializeApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = appSlice.actions;

export default appSlice.reducer;