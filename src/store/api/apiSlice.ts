import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL based on the environment
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// Define the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    prepareHeaders: (headers) => {
      // You can add authentication headers here
      return headers;
    },
  }),
  tagTypes: ['Stock', 'Sector', 'Index'],
  endpoints: (builder) => ({
    // We'll define specific endpoints in separate API slices
  }),
});

// Export hooks for usage in function components
export const {} = apiSlice;