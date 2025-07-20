// src/components/AuthChecker2.jsx - FIXED VERSION
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
        const response = await fetch(BASE_URL + '/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            console.log('✅ AuthChecker2: Server auth successful')
            // User is authenticated, update Redux store
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

    // ✅ KEY FIX: Always check server-side authentication
    // Don't rely solely on localStorage in production
    const existingUserInfo = localStorage.getItem('userInfo')

    if (!existingUserInfo) {
      console.log('📭 AuthChecker2: No localStorage, checking server...')
      checkAuthStatus()
    } else {
      console.log(
        '📦 AuthChecker2: Found localStorage, but verifying with server...'
      )
      // ✅ ALWAYS verify with server, especially for incognito/mobile
      checkAuthStatus()
    }
  }, [dispatch])

  return children
}

export default AuthChecker2
