import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from '~/stores/useAuthStore'

interface GuestRouteProps {
  children: ReactNode
  redirectTo?: string
}

const GuestRoute = ({ children, redirectTo = '/admin' }: GuestRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user) {
    return <Navigate to={redirectTo} replace />
  }
  return <>{children}</>
}

export default GuestRoute
