// admin/pages/ChatLogWindow.jsx
import { useRef, useState, useEffect } from 'react'
import { FaArrowAltCircleUp } from 'react-icons/fa'
import { useGetRoomMessagesQuery } from '../../store/adminSlice'

const ChatLogWindow = ({ selectedRoom }) => {
  const chatLogRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRoomMessagesQuery(selectedRoom?._id, { 
    skip: !selectedRoom?._id, // Don't fetch if no room selected
    // api/rooms
  })

  console.log('isError', error)

  const handleScrollTop = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const handleScroll = () => {
    if (chatLogRef.current) {
      const scrollTop = chatLogRef.current.scrollTop
      setShowScrollButton(scrollTop > 100)
    }
  }

  useEffect(() => {
    // handleScroll()
    if (messages.length === 0) {
      setShowScrollButton(false)
    }
    const chatLogElement = chatLogRef.current
    if (chatLogElement) {
      chatLogElement.addEventListener('scroll', handleScroll)
      return () => chatLogElement.removeEventListener('scroll', handleScroll)
    }
  }, [selectedRoom?._id, messages.length])

  // Auto-scroll to bottom when new room is selected
  useEffect(() => {
    if (chatLogRef.current && messages.length > 0) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [selectedRoom?._id])

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getDisplayName = (user) => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`
    }
    if (user.profile?.firstName) {
      return user.profile.firstName
    }
    return user.username
  }

  // No room selected state
  if (!selectedRoom) {
    return (
      <div className='mt-10 max-w-[90%] mx-auto rounded bg-white relative'>
        <div className='p-8 text-center text-gray-500'>
          <p className='text-2xl mb-4'>No Room Selected</p>
          <p>
            Please select a chat room from the left panel to view its messages.
          </p>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='mt-10 max-w-[90%] mx-auto rounded bg-white relative'>
        <div className=''>
          <p className='capitalize text-center text-2xl p-4 shadow-2xl'>
            Logs for {selectedRoom.name} -{' '}
            {formatDateTime(selectedRoom.lastActivity)}
          </p>
          <div className='h-150 flex items-center justify-center'>
            <p className='text-xl text-gray-500'>Loading messages...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className='mt-10 max-w-[90%] mx-auto rounded bg-white relative'>
        <div className=''>
          <p className='capitalize text-center text-2xl p-4 shadow-2xl'>
            Logs for {selectedRoom.name}
          </p>
          <div className='h-150 flex flex-col items-center justify-center text-center p-8'>
            <p className='text-xl text-red-500 mb-4'>
              Error loading messages: {error?.data?.error || error?.message}
            </p>
            <button
              onClick={refetch}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='mt-10 max-w-[90%] mx-auto rounded bg-white relative'>
      <div className=''>
        <div className='p-4 shadow-2xl bg-gray-50 '>
          <p className='capitalize text-center text-2xl font-semibold'>
            Logs for {selectedRoom.name}
          </p>
          <div className='text-center text-sm text-gray-600 mt-2'>
            <p>Room ID: {selectedRoom.roomId}</p>
            <p>Last Activity: {formatDateTime(selectedRoom.lastActivity)}</p>
            <p>Total Messages: {messages.length}</p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className='h-150 flex items-center justify-center'>
            <p className='text-xl text-gray-500'>
              No messages in this room yet.
            </p>
          </div>
        ) : (
          <ul ref={chatLogRef} className='h-150 overflow-scroll p-4'>
            {messages.map((message) => (
              <li
                key={message._id}
                className='mb-6  p-4 bg-gray-200 rounded-lg '
              >
                <div className='mb-2'>
                  <span className='text-rose-500 font-semibold capitalize'>
                    From:
                  </span>
                  <p className='text-[1rem] font-medium'>
                    {getDisplayName(message.userId)} ({message.userId.username})
                  </p>
                  {message.userId.email && (
                    <p className='text-sm text-gray-600'>
                      {message.userId.email}
                    </p>
                  )}
                </div>

                <div className='mb-2'>
                  <span className='text-rose-500 font-semibold capitalize'>
                    Message:
                  </span>
                  <p className='text-[1rem] mt-1 p-2 bg-white rounded '>
                    {message.content}
                  </p>
                  {message.edited && (
                    <p className='text-xs text-gray-500 mt-1 italic'>
                      (Edited on {formatDateTime(message.editedAt)})
                    </p>
                  )}
                </div>

                <div className='mb-2'>
                  <span className='text-rose-500 font-semibold capitalize'>
                    Date / Time:
                  </span>
                  <p className='text-[0.9rem] text-gray-700'>
                    {formatDateTime(message.createdAt)}
                  </p>
                </div>

                <div className='flex gap-4 text-xs text-gray-500'>
                  <span>Type: {message.messageType}</span>
                  {message.isSystemMessage && (
                    <span className='text-blue-600 font-semibold'>
                      System Message
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showScrollButton && (
        <FaArrowAltCircleUp
          onClick={handleScrollTop}
          className='text-6xl absolute bottom-5 right-5 cursor-pointer text-rose-500 hover:text-rose-600 transition-colors bg-white rounded-full shadow-lg'
        />
      )}
    </div>
  )
}

export default ChatLogWindow
