import React from 'react'
import { Link, Outlet } from 'react-router'

const ChatLayout = () => {
  return (
    <div className='home-screen min-h-screen'>
      <nav className=''>
        <div className=' max-w-[300px] ml-auto'></div>
      </nav>
      <Outlet />
      {/* admin button container */}
      <div className='absolute bottom-5 right-8 '>
        <Link
          to='/admin'
          target='_blank'
          rel='noopener noreferrer'
          className='admin-panel-link bg-[#ea580c] text-white text-2xl p-3 rounded cursor-pointer'
        >
          admin pannel
        </Link>
      </div>
    </div>
  )
}

export default ChatLayout
