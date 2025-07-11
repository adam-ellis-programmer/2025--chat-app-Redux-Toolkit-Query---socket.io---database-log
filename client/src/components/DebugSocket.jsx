// src/components/DebugSocket.jsx
import React from 'react'
import { useSocket } from '../context/SocketContext'
import { useSelector } from 'react-redux'

const DebugSocket = () => {
  const { socket, isConnected, availableRooms } = useSocket()
  const user = useSelector((state) => state.auth.user)

  return (
    <div className='fixed top-0 right-0 bg-black bg-opacity-75 text-white p-4 m-4 rounded z-50'>
      <h3 className='font-bold text-lg mb-2'>Socket Debug Info</h3>
      <div className='text-sm space-y-1'>
        <div>
          <strong>User:</strong>{' '}
          {user
            ? `${user.name || user.email} (ID: ${user.id})`
            : 'Not logged in'}
        </div>
        <div>
          <strong>Socket:</strong> {socket ? 'Created' : 'Not created'}
        </div>
        <div>
          <strong>Connected:</strong>
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? ' ✅ YES' : ' ❌ NO'}
          </span>
        </div>
        <div>
          <strong>Socket ID:</strong> {socket?.id || 'N/A'}
        </div>
        <div>
          <strong>Server URL:</strong>{' '}
          {import.meta.env.VITE_SERVER_URL || 'http://localhost:5001'}
        </div>
        <div>
          <strong>Available Rooms:</strong> {availableRooms.length}
        </div>
        <div>
          <strong>Socket URL:</strong> {socket?.io?.uri || 'N/A'}
        </div>
        <div>
          <strong>Transport:</strong>{' '}
          {socket?.io?.engine?.transport?.name || 'N/A'}
        </div>
      </div>
    </div>
  )
}

export default DebugSocket
