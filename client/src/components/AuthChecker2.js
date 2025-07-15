// src/components/AuthChecker2.jsx
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
            const updatedUser = {
              ...data.user,
              id: data.user._id,
              // Ensure access array exists
              access: data.user.access || ['user'], // Default to 'user' if no access array
              // Keep backward compatibility with isAdmin
              isAdmin:
                data.user.isAdmin ||
                (data.user.access && data.user.access.includes('admin')),
            }

            dispatch(setCredentials(updatedUser))
          } else {
            dispatch(setAuthCheckComplete())
          }
        } else {
          dispatch(setAuthCheckComplete())
        }
      } catch (error) {
        console.log('Auth check failed:', error)
        dispatch(setAuthCheckComplete())
      }
    }

    // Check localStorage first
    const existingUserInfo = localStorage.getItem('userInfo')
    if (!existingUserInfo) {
      checkAuthStatus()
    } else {
      try {
        const user = JSON.parse(existingUserInfo)
        // Ensure access array exists in localStorage data
        if (!user.access) {
          // If no access array, check auth from server to get updated data
          checkAuthStatus()
        } else {
          dispatch(setAuthCheckComplete())
        }
      } catch (error) {
        // Invalid localStorage data, check from server
        checkAuthStatus()
      }
    }
  }, [dispatch])

  return children
}

export default AuthChecker2
