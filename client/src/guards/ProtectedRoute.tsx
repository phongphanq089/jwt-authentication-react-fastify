import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from '~/stores/useAuthStore'

interface ProtectedRouteProps {
  children: ReactNode
  requireRole?: 'admin' | 'user' // if use check role
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated && !user) {
    return <Navigate to={'/login'} replace /> // replace có tác dụng xoá đi lịch sử route
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to='/unauthorized' replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
