import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    // API slice ka reducer add karein
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Default middleware ke saath RTK Query ka middleware jodein
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});