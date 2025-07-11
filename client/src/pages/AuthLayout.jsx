import React from 'react'
import { Outlet } from 'react-router'

const HomeLayout = () => {
  return (
    <div className='min-h-screen home-screen px-10 lg:px-0'>
      <Outlet />
    </div>
  )
}

export default HomeLayout
