import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthContext'

type RequireAuthProps = {
  children: React.ReactNode
  role?: 'runner' | 'admin'
}

const RequireAuth = ({ children, role }: RequireAuthProps) => {
  const { user, token, expiresAt, logout } = useAuth()
  const location = useLocation()

  if (!user || !user?.role || !token) {
    return <Navigate to="/benutzer" state={{ from: location.pathname }} replace />
  }

  if (expiresAt && Date.now() > expiresAt) {
    logout()
    return <Navigate to="/benutzer" state={{ from: location.pathname }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default RequireAuth
