// ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { useSocket } from '../context/SocketContext'

const ChatPage = () => {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const { roomName } = useParams() // Get room name from URL params

  // Get user from Redux store - corrected path
  const user = useSelector((state) => state.auth.userInfo)

  const {
    currentRoom,
    messages,
    participants,
    sendMessage,
    leaveRoom,
    joinRoom,
    isConnected,
  } = useSocket()
  // Replace the useEffect in ChatPage.jsx with this smarter version:

  useEffect(() => {
    // Only try to join if:
    // 1. We have a room name from URL
    // 2. User is authenticated
    // 3. Socket is connected
    // 4. We don't have a current room
    // 5. The room name in URL matches what we expect (not just left)
    if (roomName && user?.id && isConnected && !currentRoom) {
      console.log('🔍 Attempting to join room from URL:', roomName)

      // Small delay to prevent race condition with leave
      const timeoutId = setTimeout(() => {
        // Double-check we still don't have a current room
        if (!currentRoom) {
          joinRoom(roomName, user.id, user.username || user.email)
        }
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [roomName, user, currentRoom, joinRoom, isConnected])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && user) {
      // Use correct user fields: id, username, email
      sendMessage(message.trim(), user.id, user.username || user.email)
      setMessage('')
    }
  }

  const handleLeaveRoom = () => {
    console.log('🚪 handleLeaveRoom called')
    // console.log('🚪 leaveRoom function called with userId:', userId)
    console.log('🚪 Current room:', currentRoom?.name)
    if (user) {
      console.log('🚪 About to call leaveRoom with user:', user.id)
      leaveRoom(user.id)
      console.log('🚪 About to navigate to /chat/create')
      navigate('/chat/create')
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Render different message types
  const renderMessage = (msg) => {
    // System messages (join/leave notifications)
    if (msg.isSystemMessage) {
      return (
        <div key={msg.id} className='flex justify-center my-2'>
          <div className='bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full border'>
            <span className='flex items-center'>
              {msg.text.includes('joined') && '👋 '}
              {msg.text.includes('left') && '👋 '}
              {msg.text.includes('disconnected') && '📴 '}
              {msg.text.includes('created') && '🎉 '}
              {msg.text}
            </span>
            <span className='text-xs opacity-75 ml-2'>
              {formatTime(msg.timestamp)}
            </span>
          </div>
        </div>
      )
    }

    // Regular user messages
    return (
      <div
        key={msg.id}
        className={`flex ${
          msg.userId === user?.id ? 'justify-end' : 'justify-start'
        }`}
      >
        <div
          className={` rounded-lg min-w-[200px] max-w-[200px] p-3 ${
            msg.userId === user?.id
              ? 'bg-rose-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          <p className='text-sm opacity-75 mb-1'>
            {msg.userId === user?.id ? 'You' : msg.userName}
          </p>
          <p className='break-words'>{msg.text}</p>
          <p className='text-xs opacity-75 mt-1'>{formatTime(msg.timestamp)}</p>
        </div>
      </div>
    )
  }

  // Show loading state
  if (!isConnected) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-white text-2xl'>Connecting to server...</p>
      </div>
    )
  }

  // Show room loading if we have a room name but no current room
  if (roomName && !currentRoom) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-white text-2xl'>Loading room "{roomName}"...</p>
      </div>
    )
  }

  // If no room name in URL and no current room, redirect to create page
  if (!roomName && !currentRoom) {
    navigate('/chat/create')
    return null
  }

  return (
    <div className='grid lg:grid-cols-[500px_1fr] relative h-screen'>
      {/* Left sidebar */}
      <div className=''>
        <p className='text-2xl text-center text-white mt-10 capitalize'>
          {currentRoom?.name || roomName}
        </p>

        <p className='text-2xl text-white text-center'>
          participants{' '}
          <span className='bg-rose-500 rounded-full px-2 py-1 text-sm'>
            {participants.length}
          </span>
        </p>

        <div className='min-h-[300px] mt-12 m-10 bg-white rounded p-4'>
          {/* Participants list */}
          <h3 className='text-xl font-bold mb-4'>Online Users</h3>
          <ul className='space-y-2'>
            {participants.length === 0 ? (
              <li className='text-gray-500 text-center'>
                Loading participants...
              </li>
            ) : (
              participants.map((participant, i) => (
                <li
                  key={i}
                  className='flex items-center space-x-3 p-2 rounded hover:bg-gray-100'
                >
                  <div className='w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold'>
                    {(participant.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className='font-medium'>
                      {participant.name || 'Unknown User'}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {participant.id === user?.id ? 'You' : 'Online'}
                      <span className='ml-2 w-2 h-2 bg-green-500 rounded-full inline-block'></span>
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <p className='text-center text-2xl text-white'>Chat Requests</p>
        <div className='min-h-[200px] mt-12 m-10 bg-white rounded p-4'>
          <p className='text-gray-500 text-center'>No pending requests</p>
        </div>
      </div>

      {/* Right chat area */}
      <div className='flex flex-col h-full'>
        <p className='text-2xl text-center text-white mt-10 capitalize'>
          chat screen
        </p>

        <section className='flex-1 mt-20 px-4'>
          <div className='max-w-[1000px] h-[500px] bg-white mx-auto rounded relative overflow-hidden '>
            {/* Chat Messages */}
            <div className='h-full overflow-y-auto p-4 space-y-4'>
              {messages.length === 0 ? (
                <p className='text-gray-500 text-center'>
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg) => renderMessage(msg))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className='w-full bg-white max-w-[1000px] mx-auto mt-3 rounded'>
            <form onSubmit={handleSendMessage}>
              <input
                type='text'
                className='text-2xl w-full h-full p-4 rounded border-none outline-none'
                placeholder={isConnected ? 'Start Typing' : 'Connecting...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!isConnected}
              />
            </form>
          </div>
        </section>

        <section className='mt-10 pb-10 flex justify-center'>
          <div>
            <button
              onClick={handleLeaveRoom}
              className='bg-rose-500 text-white text-2xl p-3 rounded cursor-pointer hover:bg-rose-600 transition-colors'
            >
              leave chat
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ChatPage
