// pages/ChatErrorPage.jsx
import React from 'react'
import { useRouteError, Link, useNavigate } from 'react-dom'

const ChatErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  const getChatErrorContent = () => {
    if (error?.status === 401) {
      return {
        title: 'Session Expired',
        message:
          'Your session has expired. Please log in again to continue chatting.',
        icon: '⏰',
      }
    }

    if (error?.status === 404) {
      return {
        title: 'Chat Room Not Found',
        message:
          'The chat room you are looking for does not exist or has been deleted.',
        icon: '💬',
      }
    }

    return {
      title: 'Chat Error',
      message: error?.message || 'Something went wrong with the chat system.',
      icon: '🔧',
    }
  }

  const { title, message, icon } = getChatErrorContent()

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
      <div className='max-w-lg w-full text-center'>
        <div className='bg-gray-800 rounded-lg p-8 shadow-2xl border border-blue-500'>
          <div className='text-6xl mb-4'>{icon}</div>
          <h1 className='text-3xl font-bold text-white mb-2'>{title}</h1>
          <p className='text-blue-400 text-sm mb-4'>Chat System</p>
          <p className='text-gray-300 text-lg mb-6'>{message}</p>

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={() => navigate('/chat')}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Back to Chat
            </button>

            <button
              onClick={() => navigate(-1)}
              className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Go Back
            </button>

            <Link
              to='/'
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatErrorPage
