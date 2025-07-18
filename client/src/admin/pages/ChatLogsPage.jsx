// admin/pages/ChatLogsPage.jsx
import { useState } from 'react'
import SearchChats from '../SearchChats'
import ChatLogWindow from './ChatLogWindow'
import ChatRoomSelection from './ChatRoomSelection'
import BackBtn from '../../components/BackBtn'
import { useNavigate } from 'react-router'
import { useGetAllRoomsQuery } from '../../store/adminSlice'

const ChatLogsPage = () => {
  const navigate = useNavigate()
  const [selectedRoom, setSelectedRoom] = useState(null)

  // Add the query hook here to check loading state
  const { isLoading, isError, error } = useGetAllRoomsQuery()

  console.log('Selected Room: -->', selectedRoom)

  // Throw RTK Query errors to be caught by errorElement
  if (isError && error) {
    throw {
      status: error.status,
      data: error.data,
      message: error.data?.message || 'An error occurred',
    }
  } 

  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
  }

  const handleSearch = (searchTerm) => {
    // This will be handled by the SearchChats component
    // You can add additional search logic here if needed
    console.log('Searching for:', searchTerm)
  }

  // Show loading state while checking auth and fetching data
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-4'></div>
          <p className='text-white text-xl'>Loading Chat Logs...</p>
          <p className='text-gray-400 text-sm mt-2'>
            Verifying permissions and fetching rooms
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen md:max-w-[95%] mx-auto'>
      <section className='p-10'>
        <h1 className='text-3xl text-white text-center capitalize'>
          Admin Chat Logs Page
        </h1>

        {selectedRoom && (
          <div className='text-center mt-4'>
            <p className='text-white text-lg'>
              Currently viewing:{' '}
              <span className='font-semibold text-rose-400'>
                {selectedRoom.name}
              </span>
            </p>
          </div>
        )}
      </section>

      <section>
        <div className='grid md:grid-cols-[500px_1fr] gap-4'>
          <div className=''>
            <button
              onClick={() => navigate('/')}
              className='text-white text-2xl bg-gray-500 p-1 mt-3 cursor-pointer rounded'
            >
              back
            </button>
            <p className='text-white text-3xl text-center capitalize'>
              Chat Rooms
            </p>
            {/* Search Component */}
            {/* <SearchChats onSearch={handleSearch} /> */}

            {/* Room Selection Component */}
            <ChatRoomSelection
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomSelect}
            />
          </div>

          <div className=''>
            <p className='text-center text-white text-3xl capitalize'>
              Chat Logs
            </p>

            {/* Chat Log Window Component */}
            <ChatLogWindow selectedRoom={selectedRoom} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ChatLogsPage
