import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  skipProfileCheck?: boolean
}

const ProtectedRoute = ({ children, skipProfileCheck = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const { profileCompleted, profileLoading } = useProfile()

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-alt">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect to account setup if profile not completed (unless we're on the setup page)
  if (!skipProfileCheck && !profileCompleted) {
    return <Navigate to="/setup" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

