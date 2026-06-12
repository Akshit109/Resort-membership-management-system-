import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MembersPage from './pages/MembersPage'
import PaymentsPage from './pages/PaymentsPage'
import DuePaymentsPage from './pages/DuePaymentsPage'
import ImportsPage from './pages/ImportsPage'
import PublicMembersPage from './pages/PublicMembersPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public landing page */}
          <Route path='/' element={<PublicMembersPage />} />

          {/* Public login */}
          <Route path='/login' element={<LoginPage />} />

          {/* Protected admin routes */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
  <Route path='members' element={<MembersPage />} />
  <Route path='payments' element={<PaymentsPage />} />
  <Route path='due-payments' element={<DuePaymentsPage />} />
  <Route path='imports' element={<ImportsPage />} />
          </Route>

        </Routes>

        <Toaster richColors position='top-right' theme='dark' />
      </BrowserRouter>
    </AuthProvider>
  )
}