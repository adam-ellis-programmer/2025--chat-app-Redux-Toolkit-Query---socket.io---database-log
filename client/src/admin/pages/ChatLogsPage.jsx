import { sampleMessages } from '../../temp data/messageData'
import SearchChats from '../SearchChats'
import ChatLogWindow from './ChatLogWindow'
import ChatRoomSelection from './ChatRoomSelection'

const ChatLogsPage = () => {
  return (
    <div className='min-h-screen md:max-w-[95%] mx-auto'>
      <section className='p-10'>
        <h1 className='text-3xl text-white text-center capitalize'>
          admin chat logs page
        </h1>
      </section>
      {/*  */}
      <section>
        <div className='grid md:grid-cols-[500px_1fr] gap-4'>
          <div className=''>
            <p className='text-white text-3xl text-center capitalize'>
              chat rooms
            </p>
            <SearchChats /> 
            {/* room selector wrapper */}
            <ChatRoomSelection />
          </div>
          <div className=''>
            <p className='text-center  text-white text-3xl capitalize'>
              chat logs
            </p>
            <ChatLogWindow />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ChatLogsPage
