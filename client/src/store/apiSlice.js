import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants.js'

// baseQuery: Shared configuration for all API calls
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // Always send cookies with requests
  prepareHeaders: (headers, { getState }) => {
    // You can add global headers here if needed
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

// Parent API slice - shared configuration for all child slices
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Chat', 'Message', 'Room'], // For cache invalidation
  endpoints: (builder) => ({}), // Empty - endpoints injected by children
})
