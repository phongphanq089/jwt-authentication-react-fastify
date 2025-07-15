import { Route, Routes } from 'react-router'
import LoginPage from './page/Login'
import HomePage from './page/HomePage'
import ProtectedRoute from './guards/ProtectedRoute'
import AdminPage from './page/AdminPage'
import RegisterPage from './page/RegisterPage'
import GuestRoute from './guards/GuestRoute'
import VerifyEmail from './page/VerifyEmail'
import ForgotPasswordPage from './page/ForgotPasswordPage'
import VerifyEmailForgotPassPage from './page/VerifyEmailForgotPassPage'
import VerifyNewEmail from './page/verifyNewEmail'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route
        path='/login'
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/verify-email' element={<VerifyEmail />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route
        path='/verify-email-forgot-pass'
        element={<VerifyEmailForgotPassPage />}
      />
      <Route path='/confirm-change-email' element={<VerifyNewEmail />} />

      <Route
        path='/admin'
        element={
          <ProtectedRoute requireRole='admin'>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
