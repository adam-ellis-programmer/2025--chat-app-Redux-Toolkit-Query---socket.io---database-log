import React from 'react'
import { Outlet } from 'react-router'

const AdminLayout = () => {
  return (
    <div className='border min-h-screen home-screen'>
      <Outlet />
    </div>
  )
}

export default AdminLayout
