// admin/pages/ChatLogsPage.jsx
import { useState } from 'react'
import SearchChats from '../SearchChats'
import ChatLogWindow from './ChatLogWindow'
import ChatRoomSelection from './ChatRoomSelection'
import BackBtn from '../../components/BackBtn'
import { useNavigate } from 'react-router'
const ChatLogsPage = () => {
  const navigate = useNavigate()
  const [selectedRoom, setSelectedRoom] = useState(null)
  console.log('Selected Room: -->', selectedRoom)

  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
  }

  const handleSearch = (searchTerm) => {
    // This will be handled by the SearchChats component
    // You can add additional search logic here if needed
    console.log('Searching for:', searchTerm)
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
