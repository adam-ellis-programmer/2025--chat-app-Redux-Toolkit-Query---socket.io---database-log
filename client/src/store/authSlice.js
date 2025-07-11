import { createSlice } from '@reduxjs/toolkit'

// Check localStorage for existing user info
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  isAuthenticated: localStorage.getItem('userInfo') ? true : false,
  // Add loading state to track if auth check is complete
  isAuthLoading: !localStorage.getItem('userInfo'), // Only loading if no user in localStorage
  testState: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set auth loading state -- not in use
    // setAuthLoading: (state, action) => {
    //   state.isAuthLoading = action.payload
    // },

    // Set user credentials and save to localStorage
    setCredentials: (state, action) => {
      state.userInfo = action.payload
      state.isAuthenticated = true
      state.isAuthLoading = false // Auth check complete --- turn auth loading off!
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },

    // Auth check completed but no user found
    setAuthCheckComplete: (state) => {
      state.isAuthLoading = false
    },

    // Clear user credentials and localStorage
    logout: (state) => {
      state.userInfo = null
      state.isAuthenticated = false
      state.isAuthLoading = false
      localStorage.removeItem('userInfo')
    },

    // Update user profile
    updateProfile: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload }
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
  },
})

export const {
  setCredentials,
  // setAuthLoading, not using
  setAuthCheckComplete,
  logout,
  updateProfile,
} = authSlice.actions

export default authSlice.reducer
