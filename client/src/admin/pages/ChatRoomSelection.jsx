import React from 'react'

const ChatRoomSelection = () => {
  return (
    <div className='mt-20 text-white'>
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
    </div>
  )
}

export default ChatRoomSelection
