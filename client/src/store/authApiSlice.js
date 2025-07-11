import { apiSlice } from './apiSlice.js'

// End point:
const AUTH_URL = '/api/auth'
// Ask: "Does this operation change the system state?"
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation({
      query: (userData) => ({
        url: `${AUTH_URL}/register`,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout user
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Get current user
    getCurrentUser: builder.query({
      query: () => `${AUTH_URL}/me`,
      providesTags: ['User'],
      // Keep data for 5 minutes without refetching
      keepUnusedDataFor: 300,
    }),

    // Verify email
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `${AUTH_URL}/verify/${token}`,
        method: 'GET',
      }),
      invalidatesTags: ['User'], // 🔄 This tells RTK Query:
      // "The User data has changed, refresh any User queries"
    }),

    // Request password reset
    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: 'POST',
        body: { email },
      }),
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${AUTH_URL}/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
      invalidatesTags: ['User'],
    }),

    // Resend verification email
    resendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: `${AUTH_URL}/resend-verification`,
        method: 'POST',
        body: { email },
      }),
    }),
  }),
})
//   follows this naming convention:
// - Mutations: use[EndpointName]Mutation
// - Queries: use[EndpointName]Query

// Export auto-generated hooks
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useVerifyEmailMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useResendVerificationEmailMutation,
} = authApiSlice

/*
EXPLANATION:
- Injects endpoints into parent apiSlice
- Each endpoint gets auto-generated hooks
- providesTags/invalidatesTags control caching
- keepUnusedDataFor controls cache duration
*/
