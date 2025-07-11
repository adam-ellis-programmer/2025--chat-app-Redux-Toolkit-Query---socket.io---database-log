// src/components/AuthChecker.jsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, setAuthCheckComplete } from '../store/authSlice.js'
import { BASE_URL } from '../constants.js'

const AuthChecker2 = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(BASE_URL + '/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            // User is authenticated, update Redux store

            // added id so we can check auth in server socket handler
            const updatedUser = {
              ...data.user,
              id: data.user._id,
            }

            dispatch(setCredentials(updatedUser))
          } else {
            // No user found, mark auth check as complete / No JWT cookie sent / JWT cookie is expired/invalid
            dispatch(setAuthCheckComplete())
          }
        } else {
          // Request failed, mark auth check as complete
          // // HTTP error: 404, 500, network issues, etc.
          dispatch(setAuthCheckComplete())
        }
      } catch (error) {
        console.log('Auth check failed:', error)
        // Mark auth check as complete even on error
        dispatch(setAuthCheckComplete())
      }
    }

    // Only check if we don't already have user info in localStorage
    const existingUserInfo = localStorage.getItem('userInfo')
    if (!existingUserInfo) {
      checkAuthStatus()
    } else {
      // User exists in localStorage, no need to check API
      dispatch(setAuthCheckComplete()) // SUCCESS CASE! User already exists
    }
  }, [dispatch])

  return children
}

export default AuthChecker2
