// admin/pages/ChatRoomSelection.jsx
import React, { useState } from 'react'
import { useGetAllRoomsQuery } from '../../store/adminSlice'

const ChatRoomSelection = ({ selectedRoom, onRoomSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllRoomsQuery()
 
  console.log('isError-->', error)

  // Throw RTK Query errors to be caught by errorElement
  if (isError && error) {
    throw {
      status: error.status,
      data: error.data,
      message: error.data?.message || 'An error occurred',
    }
  }

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Remove loading state since it's handled by parent component
  // if (isLoading) {
  //   return (
  //     <div className='mt-10 text-white'>
  //       <div className='shadow-2xl p-5 bg-rose-500 rounded'>
  //         <p className='text-2xl text-center capitalize'>select chat room</p>
  //       </div>
  //       <div className='p-10 text-center'>
  //         <p>Loading rooms...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className='mt-10 text-white'>
      <div className='shadow-2xl p-5 bg-rose-500 rounded'>
        <p className='text-2xl text-center capitalize'>select chat room</p>
      </div>

      {/* Search Input */}
      <div className='mt-4 mb-4'>
        <input
          type='text'
          placeholder='Search rooms...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-rose-500 focus:outline-none'
        />
      </div>

      <div className='h-140 overflow-scroll'>
        {filteredRooms.length === 0 ? (
          <div className='p-10 text-center'>
            <p>No rooms found</p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <article
              key={room._id}
              onClick={() => onRoomSelect(room)}
              className={`shadow-2xl p-6 rounded-2xl mb-4 cursor-pointer transition-all hover:bg-gray-700 ${
                selectedRoom?._id === room._id
                  ? 'bg-gray-600 border-2 border-rose-500'
                  : 'bg-gray-800'
              }`}
            >
              <div className='flex justify-between items-start mb-2'>
                <p className='text-xl font-semibold'>{room.name}</p>
                {room.isPrivate && (
                  <span className='text-xs bg-yellow-500 text-black px-2 py-1 rounded'>
                    Private
                  </span>
                )}
              </div>

              <div className='space-y-1 text-sm text-gray-300'>
                <p>
                  <span className='text-rose-400'>Room ID:</span> {room.roomId}
                </p>
                <p>
                  <span className='text-rose-400'>Created:</span>{' '}
                  {formatDate(room.createdAt)}
                </p>
                <p>
                  <span className='text-rose-400'>Last Activity:</span>{' '}
                  {formatDate(room.lastActivity)} at{' '}
                  {formatTime(room.lastActivity)}
                </p>
                <p>
                  <span className='text-rose-400'>Participants:</span>{' '}
                  {room.participantCount}
                </p>
                <p>
                  <span className='text-rose-400'>Messages:</span>{' '}
                  {room.messageCount}
                </p>
                {room.createdBy && (
                  <p>
                    <span className='text-rose-400'>Created by:</span>{' '}
                    {room.createdBy.username}
                  </p>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatRoomSelection
