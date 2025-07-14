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
      { path: ':roomName', Component: ChatPage }, // Add dynamic room route
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      { index: true, Component: AdminHome },
      { path: 'logs', Component: ChatLogsPage },
      { path: 'users', Component: UsersPage },
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

/* EXPLANATION:
- Added SocketProvider around ChatLayout to provide socket context to all chat-related pages
- Added dynamic route for individual chat rooms (:roomName)
- Socket context is only active when users are in the chat section (more efficient)
- Maintains your existing Redux and Auth structure
*/
