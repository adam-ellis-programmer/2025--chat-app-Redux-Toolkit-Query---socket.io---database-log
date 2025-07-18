// store/adminApiSlice.js
import { apiSlice } from './apiSlice.js'

// API endpoints
const ROOMS_URL = '/api/rooms'
const MESSAGES_URL = '/api/messages'
const AUTH_URL = '/api/auth'

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all rooms for admin
    getAllRooms: builder.query({
      query: () => ({
        url: ROOMS_URL,
        method: 'GET',
      }),
      
      providesTags: ['Room'],
      transformResponse: (response) => {
        // Sort rooms by last activity (most recent first)
        return response.sort(
          (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
        )
      },
    }),

    // Get messages for a specific room
    getRoomMessages: builder.query({
      query: (roomId) => ({
        url: `${MESSAGES_URL}/room/${roomId}`,
        method: 'GET',
      }),

      providesTags: (result, error, roomId) => [
        { type: 'Message', id: roomId },
        'Message',
      ],

      transformResponse: (response) => {
        // Sort messages chronologically (oldest first for chat display)
        return response.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      },
    }),

    // Get all rooms with their message counts (for admin overview)
    getAllUsers: builder.query({
      query: () => ({
        url: `${AUTH_URL}/all-users`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // // Get all rooms with their message counts (for admin overview)
    // getRoomsWithStats: builder.query({
    //   query: () => ({
    //     url: `${ROOMS_URL}?includeStats=true`,
    //     method: 'GET',
    //   }),
    //   providesTags: ['Room', 'Message'],
    // }),

    // // Search/filter rooms
    // searchRooms: builder.query({
    //   query: (searchTerm) => ({
    //     url: `${ROOMS_URL}?search=${encodeURIComponent(searchTerm)}`,
    //     method: 'GET',
    //   }),
    //   providesTags: ['Room'],
    // }),

    // // Get room details with participants
    // getRoomDetails: builder.query({
    //   query: (roomId) => ({
    //     url: `${ROOMS_URL}/${roomId}`,
    //     method: 'GET',
    //   }),
    //   providesTags: (result, error, roomId) => [{ type: 'Room', id: roomId }],
    // }),
  }),
})

// Export hooks for use in components
export const {
  useGetAllRoomsQuery,
  useGetRoomMessagesQuery,
  useGetAllUsersQuery,
  // useGetRoomsWithStatsQuery,
  // useSearchRoomsQuery,
  // useGetRoomDetailsQuery,
  // useLazyGetRoomMessagesQuery, // For manually triggering queries
  // useLazySearchRoomsQuery,
} = adminApiSlice
