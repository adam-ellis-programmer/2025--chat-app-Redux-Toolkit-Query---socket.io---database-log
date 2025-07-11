// components/AuthChecker.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetCurrentUserQuery } from '../store/authApiSlice'
import { setCredentials } from '../store/authSlice'

const AuthChecker = ({ children }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth)

  console.log('🔍 AuthChecker - Current state:', {
    isAuthenticated,
    hasUserInfo: !!userInfo,
  })

  // Only fetch user if not already authenticated (or no user info in Redux)
  const { data, isSuccess, error, isLoading } = useGetCurrentUserQuery(
    undefined,
    {
      skip: isAuthenticated && userInfo, // Skip if already authenticated AND have user info
    }
  )

  console.log('🔍 AuthChecker - Query state:', {
    isLoading,
    isSuccess,
    hasData: !!data,
    error: error?.status,
  })

  useEffect(() => {
    // If we get user data back, it means there's a valid JWT cookie
    if (isSuccess && data?.user) {
      console.log('🔄 Found valid JWT session, updating Redux state...')
      console.log('User data:', data.user)

      // Update Redux state and localStorage using your existing action
      dispatch(setCredentials(data.user))

      console.log('✅ Redux state updated with user info')
    }
  }, [isSuccess, data, dispatch])

  // Optional: Log authentication errors (but don't block the app)
  useEffect(() => {
    if (error && error.status === 401) {
      console.log('ℹ️ No valid session found (user not logged in)')
    } else if (error) {
      console.error('❌ Auth check failed:', error)
    }
  }, [error])

  return children
}

export default AuthChecker
