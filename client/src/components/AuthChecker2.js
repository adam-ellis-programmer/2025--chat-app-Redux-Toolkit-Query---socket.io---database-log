// Updated AuthChecker2.jsx - Handle both cookie and token authentication

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, setAuthCheckComplete } from '../store/authSlice.js'
import { BASE_URL } from '../constants.js'

const AuthChecker2 = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 AuthChecker2: Checking server auth status...')

        // ✅ Try cookie-based auth first
        let response = await fetch(BASE_URL + '/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        })

        // ✅ If cookie auth fails in production, try token from localStorage
        if (!response.ok) {
          const storedToken = localStorage.getItem('authToken')
          if (storedToken) {
            console.log('🔄 Cookie auth failed, trying token auth...')
            response = await fetch(BASE_URL + '/api/auth/me', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            })
          }
        }

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            console.log('✅ AuthChecker2: Server auth successful')
            const updatedUser = {
              ...data.user,
              id: data.user._id,
              access: data.user.access || ['user'],
              isAdmin:
                data.user.isAdmin ||
                (data.user.access && data.user.access.includes('admin')),
            }
            dispatch(setCredentials(updatedUser))
          } else {
            console.log('❌ AuthChecker2: Server auth failed - no user data')
            dispatch(setAuthCheckComplete())
          }
        } else {
          console.log('❌ AuthChecker2: Server auth failed - response not ok')
          // Clear any stored token if auth fails
          localStorage.removeItem('authToken')
          dispatch(setAuthCheckComplete())
        }
      } catch (error) {
        console.log(
          '❌ AuthChecker2: Server auth failed - network error:',
          error
        )
        dispatch(setAuthCheckComplete())
      }
    }

    checkAuthStatus()
  }, [dispatch])

  return children
}

export default AuthChecker2
