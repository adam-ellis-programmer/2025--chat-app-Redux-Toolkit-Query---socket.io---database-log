// components/AdminProtectedRoute.jsx
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const AdminProtectedRoute = ({ children, requiredRoles = ['admin'] }) => {
  const { userInfo, isAuthLoading } = useSelector((state) => state.auth)

  // console.log('AdminProtectedRoute - userInfo:', userInfo)
  // console.log('AdminProtectedRoute - isAuthLoading:', isAuthLoading)
  // console.log('AdminProtectedRoute - userRoles:', userInfo?.access)

  // Still checking auth status
  if (isAuthLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!userInfo) {
    return <Navigate to='/email-sign-in' replace />
  }

  // Check if user has required roles
  const userRoles = userInfo.access || []
  const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role))

  // console.log('Required roles:', requiredRoles)
  // console.log('User roles:', userRoles)
  // console.log('Has required role:', hasRequiredRole)

  // User doesn't have required role
  if (!hasRequiredRole) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='text-center p-8 bg-white rounded-lg shadow-md'>
          <div className='text-red-500 text-6xl mb-4'>🚫</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            Access Denied
          </h1>
          <p className='text-gray-600 mb-4'>
            You don't have permission to access this area.
          </p>
          <p className='text-sm text-gray-500 mb-4'>
            Required roles: {requiredRoles.join(', ')}
          </p>
          <p className='text-sm text-gray-500 mb-6'>
            Your roles: {userRoles.length > 0 ? userRoles.join(', ') : 'none'}
          </p>
          <button
            onClick={() => window.history.back()}
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // User has required role, render children
  return children
}

export default AdminProtectedRoute
