import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from '~/stores/useAuthStore'

interface ProtectedRouteProps {
  children: ReactNode
  requireRole?: 'admin' | 'user' // if use check role
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()

  const userRole = 'admin'

  if (!isAuthenticated && !user) {
    return <Navigate to={'/login'} replace />
  }

  // if (requireRole && user?.role !== requireRole) {
  //   return <Navigate to='/unauthorized' replace />
  // }

  if (requireRole && userRole !== requireRole) {
    return <Navigate to='/unauthorized' replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
