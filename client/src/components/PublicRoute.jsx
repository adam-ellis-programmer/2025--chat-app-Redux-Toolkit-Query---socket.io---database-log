import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const PublicRoute = ({ children, redirectTo = '/chat/create' }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    // User is logged in, redirect them away from public pages
    return <Navigate to={redirectTo} replace />
  }

  // User is not logged in, show the public page
  return children
}

export default PublicRoute

/* 
EXPLANATION:
- Opposite of ProtectedRoute
- Redirects authenticated users away from login/register pages
- Prevents logged-in users from seeing login forms
- Default redirects to /user-dash but customizable
*/
