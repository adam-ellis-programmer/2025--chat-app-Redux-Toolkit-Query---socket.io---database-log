import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useSelector((state) => state.auth)

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='loading loading-spinner loading-lg'></div>
          <p className='mt-4 text-lg'>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Auth check complete - redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/email-sign-in' replace />
  }

  // User is authenticated, render protected content
  return children
}

export default ProtectedRoute

/* EXPLANATION:
- Shows loading spinner while AuthChecker is running
- Only redirects after auth check is complete
- Prevents premature redirects during Google OAuth flow
*/
