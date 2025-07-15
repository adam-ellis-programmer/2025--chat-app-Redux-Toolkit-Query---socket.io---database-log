import React from 'react'
import { IoChatbox } from 'react-icons/io5'
import { FaUsers } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import BackBtn from '../../components/BackBtn'

const AdminHome = () => {
  const navigate = useNavigate()

  const handleLogNav = () => {
    navigate('/admin/logs')
  }
  const handleUserNav = () => {
    navigate('/admin/users')
  }
  return (
    <div>
      <section className='pt-20'>
        <h1 className='capitalize text-4xl text-white text-center font-[300]'>
          administrators panel
        </h1>
      </section>

      <section className='mt-20  max-w-[1200px] mx-auto'>
        <div className='grid  grid-cols-2 gap-10'>
          {/*  */}
          <div
            onClick={handleLogNav}
            className='text-white   flex items-center shadow-2xl p-10 rounded-2xl cursor-pointer'
          >
            <IoChatbox className='text-8xl' />
            <p className='text-2xl font-[300] ml-10'>view chat logs </p>
          </div>
          <div
            onClick={handleUserNav}
            className='text-white   flex items-center shadow-2xl p-10 rounded-2xl cursor-pointer'
          >
            <FaUsers className='text-8xl' />
            <p className='text-2xl font-[300] ml-10'>view users </p>
          </div>
        </div>
      </section>
      {/* dynamic button */}
      <div className='flex justify-center  mt-20'>
        <BackBtn route='/' />
      </div>
    </div>
  )
}

export default AdminHome
