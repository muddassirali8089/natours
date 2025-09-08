import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectUser } from '../../features/auth/authSlice'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireGuide = false,
  requireLeadGuide = false 
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const location = useLocation()

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (requireAdmin && !user?.roles?.includes('admin')) {
    return <Navigate to="/" replace />
  }

  if (requireLeadGuide && !user?.roles?.includes('lead-guide') && !user?.roles?.includes('admin')) {
    return <Navigate to="/" replace />
  }

  if (requireGuide && !user?.roles?.includes('guide') && !user?.roles?.includes('lead-guide') && !user?.roles?.includes('admin')) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
