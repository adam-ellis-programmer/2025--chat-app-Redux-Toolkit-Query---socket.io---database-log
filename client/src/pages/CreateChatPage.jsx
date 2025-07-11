// CreateChatPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useSocket } from '../context/SocketContext'
import LogoutBtn from '../components/Auth Buttons/LogoutBtn'

// // In CreateChatPage.jsx
// import { useContext } from 'react'
// import { SocketContext } from '../context/SocketContext'

// WITH OUT THE HOOK WE WOULD WRITE THIS
// const CreateChatPage = () => {
// const context = useContext(SocketContext)
// if (!context) {
// throw new Error('useSocket must be used within a SocketProvider')
// }
// const { availableRooms, createRoom, joinRoom, getRooms, isConnected } = context

// ... rest of component
// }

const CreateChatPage = () => {
  const [roomName, setRoomName] = useState('')
  const navigate = useNavigate()

  // Get user from Redux store - corrected path
  const user = useSelector((state) => state.auth.userInfo)

  const { availableRooms, createRoom, joinRoom, getRooms, isConnected } =
    useSocket()

  useEffect(() => {
    // Get available rooms when component mounts and connection is established
    // Only call once when isConnected becomes true
    if (isConnected) {
      getRooms()
    }
  }, [isConnected])

  const handleCreateRoom = (e) => {
    e.preventDefault()
    if (roomName.trim() && user) {
      // Use correct user fields: id, username, email
      createRoom(roomName.trim(), user.id, user.username || user.email)
      // Navigate to the new room using the dynamic route
      navigate(`/chat/${roomName.trim()}`)
    }
  }

  const handleJoinRoom = (roomToJoin) => {
    if (user) {
      // Use correct user fields: id, username, email
      joinRoom(roomToJoin.name, user.id, user.username || user.email)
      // Navigate to the existing room using the dynamic route
      navigate(`/chat/${roomToJoin.name}`)
    }
  }

  return (
    <div>
      <section>
        <p className='capitalize text-3xl text-center text-white pt-20'>
          create or join chat
        </p>
      </section>

      <section className='mt-10'>
        <div className='grid grid-cols-2'>
          <div>
            <form onSubmit={handleCreateRoom} className='max-w-[500px] mx-auto'>
              <p className='capitalize text-2xl text-center text-white mb-5'>
                create a room
              </p>
              <input
                type='text'
                className='bg-white w-full text-3xl p-4'
                placeholder='Type Room Name'
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
              <div className='mt-3 flex flex-col'>
                <button
                  type='submit'
                  className='bg-rose-500 text-white cursor-pointer text-2xl p-3 w-full mb-2 disabled:opacity-50'
                  disabled={!isConnected || !roomName.trim()}
                >
                  Start Chat
                </button>
                <LogoutBtn />
              </div>
            </form>
          </div>

          <div>
            <p className='text-2xl text-center text-white capitalize'>
              rooms in use
            </p>

            <ul className='max-w-[300px] mx-auto mt-10'>
              {availableRooms.length === 0 ? (
                <li className='text-center text-white text-xl'>
                  {isConnected ? 'No active rooms' : 'Loading rooms...'}
                </li>
              ) : (
                availableRooms.map((room) => (
                  <li
                    key={room.id}
                    className='flex justify-between items-center bg-white rounded h-10 mb-2'
                  >
                    <div className='px-2 flex items-center space-x-2'>
                      <p className='capitalize'>{room.name}</p>
                      <span className='bg-rose-500 text-white text-xs px-2 py-1 rounded-full'>
                        {room.participants.length}
                      </span>
                    </div>
                    <button
                      onClick={() => handleJoinRoom(room)}
                      className='bg-rose-500 h-full text-white w-30 cursor-pointer px-3 disabled:opacity-50 hover:bg-rose-600'
                      disabled={!isConnected}
                    >
                      join room
                    </button>
                  </li>
                ))
              )}
            </ul>

            {!isConnected && (
              <p className='text-center text-red-400 mt-4'>
                Connecting to server...
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CreateChatPage
