import React from 'react'

const ChatRoomSelection = () => {
  return (
    <div className='mt-10 text-white'>
      <div className='shadow-2xl p-5 bg-rose-500 rounded'>
        <p className='text-2xl text-center capitalize'>select chat room</p>
      </div>

      <div className=' h-140 overflow-scroll'>
        {/* room div */}
        <article className=' shadow-2xl p-10 rounded-2xl mb-7 cursor-pointer'>
          <p className='text-2xl'>travel room</p>
          <p className='mt-1'>05/05/2025</p>
          <p className='mt-1 capitalize'>3 participants</p>
        </article>

        <article className=' shadow-2xl p-10 rounded-2xl mb-7 cursor-pointer'>
          <p className='text-2xl'>managers meeting</p>
          <p className='mt-1'>05/05/2025</p>
          <p className='mt-1 capitalize'>6 participants</p>
        </article>

        
        <article className=' shadow-2xl p-10 rounded-2xl mb-7 cursor-pointer'>
          <p className='text-2xl'>travel room</p>
          <p className='mt-1'>05/05/2025</p>
          <p className='mt-1 capitalize'>3 participants</p>
        </article>

        <article className=' shadow-2xl p-10 rounded-2xl mb-7 cursor-pointer'>
          <p className='text-2xl'>managers meeting</p>
          <p className='mt-1'>05/05/2025</p>
          <p className='mt-1 capitalize'>6 participants</p>
        </article>

        <article className=' shadow-2xl p-10 rounded-2xl mb-7 cursor-pointer'>
          <p className='text-2xl'>travel room</p>
          <p className='mt-1'>05/05/2025</p>
          <p className='mt-1 capitalize'>3 participants</p>
        </article>

        <article className=' shadow-2xl p-10 rounded-2xl mb-7 cursor-pointer'>
          <p className='text-2xl'>managers meeting</p>
          <p className='mt-1'>05/05/2025</p>
          <p className='mt-1 capitalize'>6 participants</p>
        </article>


      </div>
    </div>
  )
}

export default ChatRoomSelection
