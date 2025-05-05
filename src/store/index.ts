import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import marketReducer from './slices/marketSlice';
import stockReducer from './slices/stockSlice';
import appReducer from './slices/appSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    theme: themeReducer,
    market: marketReducer,
    stock: stockReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;