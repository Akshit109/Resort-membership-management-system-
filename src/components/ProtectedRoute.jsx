import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center text-muted'>
        Loading secure workspace...
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to='/login' replace />

  return children
}