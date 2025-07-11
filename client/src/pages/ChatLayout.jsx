import React from 'react'
import { Link, Outlet } from 'react-router'

const ChatLayout = () => {
  return (
    <div className='home-screen min-h-screen'>
      <nav className=''>
        <div className=' max-w-[300px] ml-auto'>
          <ul className='flex justify-around text-2xl text-white'>
            <li>
              <Link to={`/`}>Home</Link>
            </li>
            <li>
              <Link to={`/chat`}>Chat</Link>
            </li>
            <li>
              <Link to={`/chat/create`}>Create</Link>
            </li>
            <li>
              <Link to={`/chat/create`}>Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}

export default ChatLayout
