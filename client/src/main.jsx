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
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx'

import AuthChecker from './components/AuthChecker.js'
import AuthChecker2 from './components/AuthChecker2.js'

// ERROR PAGES
import RootErrorPage from './error/RootErrorPage.jsx'
import ChatErrorPage from './error/ChatErrorPage.jsx'
import AdminErrorPage from './error/AdminErrorPage.jsx'
import NotFoundPage from './error/NotFoundPage.jsx'

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
    errorElement: <RootErrorPage />, // Root level errors
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        ),
      },
      {
        path: 'email-sign-in',
        Component: EmailSignIn,
        errorElement: <RootErrorPage />,
      },
      {
        path: 'email-register',
        Component: EmailRegister,
        errorElement: <RootErrorPage />,
      },
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
    errorElement: <ChatErrorPage />, // Chat-specific error handling
    children: [
      {
        index: true,
        Component: ChatPage,
        errorElement: <ChatErrorPage />,
      },
      {
        path: 'create',
        Component: CreateChatPage,
        errorElement: <ChatErrorPage />,
      },
      {
        path: 'user',
        Component: UserDash,
        errorElement: <ChatErrorPage />,
      },
      {
        path: ':roomName',
        Component: ChatPage,
        errorElement: <ChatErrorPage />, // Route-specific error handling
      },
    ],
  },
  {
    path: 'admin',
    element: (
      <AdminProtectedRoute requiredRoles={['admin']}>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    errorElement: <AdminErrorPage />, // Admin-specific error handling
    children: [
      {
        index: true,
        Component: AdminHome,
        errorElement: <AdminErrorPage />,
      },
      {
        path: 'logs',
        element: (
          <AdminProtectedRoute requiredRoles={['admin']}>
            <ChatLogsPage />
          </AdminProtectedRoute>
        ),
        errorElement: <AdminErrorPage />,
      },
      {
        path: 'users',
        element: (
          <AdminProtectedRoute requiredRoles={['admin', 'manager']}>
            <UsersPage />
          </AdminProtectedRoute>
        ),
        errorElement: <AdminErrorPage />, // This will catch authorization errors
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthChecker2>
      <RouterProvider router={router} />
    </AuthChecker2>
  </Provider>
)
