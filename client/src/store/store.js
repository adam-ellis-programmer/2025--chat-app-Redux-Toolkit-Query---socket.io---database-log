import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice.js'
import authReducer from './authSlice.js'
//
//
// USE OF COMPUTED VALUES [] ??
export const store = configureStore({
  reducer: {
    // Auth client state
    auth: authReducer,
    // RTK Query API cache
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Problem: RTK Query actions contain non-serializable data (functions, promises)
        // Solution: Tell middleware "ignore these specific RTK Query actions"
        // Ignore RTK Query action types
        ignoredActions: [apiSlice.util.resetApiState.type],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

/*
EXPLANATION:
- Combines auth slice and API slice
- Adds RTK Query middleware for caching
- Enables Redux DevTools in development
- Configures serializable check to ignore RTK Query actions
*/
