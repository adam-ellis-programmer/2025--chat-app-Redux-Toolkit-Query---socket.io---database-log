// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { SocketProvider } from './context/SocketContext.jsx'
import {
  EmailRegister,
  EmailSignIn,
  HomeLayout,
  HomePage,
  ChatLayout,
  ChatPage,
  UserDash,
} from './pages/index.js'
import CreateChatPage from './pages/CreateChatPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx' // ← New import

import AuthChecker from './components/AuthChecker.js'
import AuthChecker2 from './components/AuthChecker2.js'
// ADMIN ROUTES
import {
  AdminHome,
  AdminLayout,
  ChatLogsPage,
  UsersPage,
} from './admin/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        ),
      },
      { path: 'email-sign-in', Component: EmailSignIn },
      { path: 'email-register', Component: EmailRegister },
    ],
  },
  {
    path: 'chat',
    element: (
      <ProtectedRoute>
        <SocketProvider>
          <ChatLayout />
        </SocketProvider>
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: ChatPage },
      { path: 'create', Component: CreateChatPage },
      { path: 'user', Component: UserDash },
      { path: ':roomName', Component: ChatPage },
    ],
  },
  {
    path: 'admin',
    element: (
      <AdminProtectedRoute requiredRoles={['admin']}>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, Component: AdminHome },
      {
        path: 'logs',
        element: (
          <AdminProtectedRoute requiredRoles={['admin']}>
            {' '}
            {/* ← Extra protection for sensitive routes */}
            <ChatLogsPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <AdminProtectedRoute requiredRoles={['admin', 'manager']}>
            {' '}
            {/* ← Managers can also access */}
            <UsersPage />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthChecker2>
      <RouterProvider router={router} />
    </AuthChecker2>
  </Provider>
)
