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
        <Link to={`/admin`}>
          <button className='bg-[#ea580c] text-white text-2xl p-3 rounded cursor-pointer'>
            admin pannel
          </button>
        </Link>
      </div>
    </div>
  )
}

export default ChatLayout
