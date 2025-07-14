import { Route, Routes } from 'react-router'
import LoginPage from './page/Login'
import HomePage from './page/HomePage'
import ProtectedRoute from './guards/ProtectedRoute'
import AdminPage from './page/AdminPage'
import RegisterPage from './page/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

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
