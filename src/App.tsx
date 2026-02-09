import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthProvider } from './auth/AuthContext'
import SiteLayout from './layouts/SiteLayout'
import Welcome from './pages/Welcome'
import UserPage from './pages/UserPage'
import RunnerDashboard from './pages/RunnerDashboard'
import AdminPage from './pages/AdminPage'
import NotFound from './pages/NotFound'
import RequireAuth from './routes/RequireAuth'

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <Welcome /> },
      { path: '/benutzer', element: <UserPage /> },
      {
        path: '/dashboard',
        element: (
          <RequireAuth role="runner">
            <RunnerDashboard />
          </RequireAuth>
        ),
      },
      { path: '/admin', element: <AdminPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
