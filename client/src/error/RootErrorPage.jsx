// pages/RootErrorPage.jsx
import React from 'react'
import { useRouteError, Link, useNavigate } from 'react-dom'

const RootErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
      <div className='max-w-lg w-full text-center'>
        <div className='bg-gray-800 rounded-lg p-8 shadow-2xl'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h1 className='text-3xl font-bold text-white mb-4'>
            Something went wrong
          </h1>
          <p className='text-gray-300 text-lg mb-6'>
            {error?.message || 'An unexpected error occurred.'}
          </p>

          {error?.status && (
            <p className='text-gray-500 text-sm mb-6'>
              Error Code: {error.status}
            </p>
          )}

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={() => window.location.reload()}
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Reload Page
            </button>

            <button
              onClick={() => navigate(-1)}
              className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Go Back
            </button>

            <Link
              to='/'
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RootErrorPage
