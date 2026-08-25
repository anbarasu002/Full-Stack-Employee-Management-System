import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from './Loader.jsx'

export default function PublicOnlyRoute() {
  const { isAuthenticated, checkingSession } = useAuth()

  if (checkingSession) {
    return <Loader label="Loading…" />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
