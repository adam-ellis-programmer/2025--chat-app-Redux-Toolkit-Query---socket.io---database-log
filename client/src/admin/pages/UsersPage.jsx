import React, { useState } from 'react'
import { useGetAllUsersQuery } from '../../store/adminSlice'
import BackBtn from '../../components/BackBtn'

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState({})
  const { data, isLoading } = useGetAllUsersQuery()
  const users = data?.users || []

  if (!isLoading) {
    console.log(users)
  }

  // Safe way to get profile entries
  // const profileEntries = Object.entries(selectedUser.profile || {})
  // {profileEntries.map(([key, value], index) => ( --> we use here in loop

  // Extract the specific fields to display
  // prettier-ignore
  const userFields = [
    { key: 'firstName', value: selectedUser.profile?.firstName || '', label: 'First Name' },
    { key: 'lastName', value: selectedUser.profile?.lastName || '', label: 'Last Name' },
    { key: 'email', value: selectedUser.email || '', label: 'Email' }
  ]

  const isSelectedUserEmpty = Object.keys(selectedUser).length === 0
  console.log('isSelectedUserEmpty', isSelectedUserEmpty)

  return (
    <div>
      <section className='mt-5'>
        <p className='text-4xl text-center text-white capitalize'>users page</p>
        <p className='text-2xl text-center text-white capitalize mt-2'>
          admin panel
        </p>
      </section>

      <section className='mt-10'>
        <div className='grid grid-cols-2 gap-10  max-w-[1500px] mx-auto'>
          <div className=''>
            <p className='text-center text-2xl text-white mb-10 capitalize'>
              select user
            </p>
            <div className='h-130 overflow-scrol p-5 overflow-scroll'>
              {users.map((item, i) => {
                return (
                  <article
                    onClick={() =>
                      setSelectedUser({
                        profile: item.profile,
                        email: item.email,
                      })
                    }
                    key={i}
                    className={`text-white text-2xl shadow-2xl p-4 mb-5 rounded cursor-pointer ${
                      selectedUser.email === item.email
                        ? 'bg-[#64748b] custom-offset-bd'
                        : 'bg-[#1f2937]' // Default background
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <p>{item.username}</p>
                        <p>{item.email}</p>
                      </div>
                      <img
                        src={item.profile.avatar}
                        className='w-[50px]'
                        alt=''
                      />
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
          <div className=''>
            <p className='text-center text-2xl text-white mb-10 capitalize'>
              user details
            </p>

            <div className='h-100 bg-[#4b5563] p-5'>
              <form onSubmit={(e) => e.preventDefault()} action=''>
                <div className='grid grid-cols-2 gap-4'>
                  {userFields.map((field, i) => {
                    return (
                      <input
                        key={field.key}
                        type={field.key === 'email' ? 'email' : 'text'}
                        name={field.key}
                        id={field.key}
                        className={`bg-white w-full text-2xl p-3 rounded ${
                          i === 2 && 'col-span-full'
                        }`}
                        placeholder={field.label}
                        defaultValue={field.value}
                      />
                    )
                  })}
                </div>
                <div className='mt-5 rounded'>
                  <button className='text-2xl text-white text-center bg-red-500 p-2 w-40 cursor-pointer'>
                    update
                  </button>
                </div>
              </form>
            </div>
            {/*  */}
            <div className='mt-5 flex justify-end'>
              <BackBtn route={`/`} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UsersPage
