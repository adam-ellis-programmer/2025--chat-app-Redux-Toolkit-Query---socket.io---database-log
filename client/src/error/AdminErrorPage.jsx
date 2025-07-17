// pages/AdminErrorPage.jsx
import React, { useEffect } from 'react'
import { useRouteError, Link, useNavigate } from 'react-router'

const AdminErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  console.error('Admin Route Error____>:', error)

  const getAdminErrorContent = () => {
    if (error?.status === 401) {
      return {
        title: 'Authentication Required',
        message: 'You need to log in to access the admin panel.',
        icon: '🔒',
        actions: [
          {
            label: 'Sign In',
            path: '/email-sign-in',
            style: 'bg-blue-600 hover:bg-blue-700',
          },
          {
            label: 'Go Home',
            path: '/',
            style: 'bg-gray-600 hover:bg-gray-700',
          },
        ],
      }
    }

    if (error?.status === 403) {
      return {
        title: 'Access Denied',
        message:
          error?.data?.message ||
          'You do not have the required permissions to access this admin area.',
        icon: '🚫',
        actions: [
          {
            label: 'Go Back',
            action: () => navigate(-1),
            style: 'bg-gray-600 hover:bg-gray-700',
          },
          {
            label: 'Go to Chat',
            path: '/chat',
            style: 'bg-blue-600 hover:bg-blue-700',
          },
          {
            label: 'Go Home',
            path: '/',
            style: 'bg-gray-600 hover:bg-gray-700',
          },
        ],
      }
    }

    return {
      title: 'Admin Panel Error',
      message: error?.message || 'An error occurred in the admin panel.',
      icon: '⚠️',
      actions: [
        {
          label: 'Try Again',
          action: () => window.location.reload(),
          style: 'bg-green-600 hover:bg-green-700',
        },
        {
          label: 'Go Back',
          action: () => navigate(-1),
          style: 'bg-gray-600 hover:bg-gray-700',
        },
        { label: 'Go Home', path: '/', style: 'bg-blue-600 hover:bg-blue-700' },
      ],
    }
  }

  const { title, message, icon, actions } = getAdminErrorContent()

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
      <div className='max-w-lg w-full text-center'>
        <div className='bg-gray-800 rounded-lg p-8 shadow-2xl border border-red-500'>
          <div className='text-6xl mb-4'>{icon}</div>
          <h1 className='text-3xl font-bold text-white mb-2'>{title}</h1>
          <p className='text-red-400 text-sm mb-4'>Admin Panel</p>
          <p className='text-gray-300 text-lg mb-6'>{message}</p>

          {error?.status && (
            <p className='text-gray-500 text-sm mb-6'>
              Error Code: {error.status}
            </p>
          )}

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            {actions.map((action, index) =>
              action.path ? (
                <Link
                  key={index}
                  to={action.path}
                  className={`${action.style} text-white px-4 py-2 rounded-lg transition-colors`}
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.style} text-white px-4 py-2 rounded-lg transition-colors`}
                >
                  {action.label}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminErrorPage
