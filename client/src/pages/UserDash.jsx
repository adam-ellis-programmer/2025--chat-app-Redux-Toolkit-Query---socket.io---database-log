import React, { useState, useEffect } from 'react'
import { useGetCurrentUserQuery } from '../store/authApiSlice.js'
import FormTextInput from '../components/inputs/FormTextInput'
import { Link } from 'react-router'
const elements = [
  {
    id: 1,
    type: 'text',
    name: 'username',
    placeholder: 'Enter User Name',
    defaultValue: 'test-user-123',
  },
  {
    id: 2,
    type: 'text',
    name: 'firstName',
    placeholder: 'Enter First Name',
  },
  {
    id: 3,
    type: 'text',
    name: 'lastName',
    placeholder: 'Enter Last Name',
    defaultValue: 'User',
  },
  {
    id: 4,
    type: 'text',
    name: 'email',
    placeholder: 'Enter Email',
    defaultValue: 'test.user@gmail.com',
  },
  {
    id: 5,
    type: 'password',
    name: 'password',
    placeholder: 'Enter Password',
    defaultValue: '111111',
  },
  {
    id: 6,
    type: 'checkbox',
    name: 'isVerified',
    text: 'Is Verified',
    defaultValue: true,
  },
  {
    id: 7,
    type: 'checkbox',
    name: 'isOnline',
    text: 'Is On Line',
    defaultValue: false,
  },
]

const UserDash = () => {
  // Fetch current user data
  const { data, error, isLoading } = useGetCurrentUserQuery()
  // console.log(data)

  // Initialize form data from elements default values
  const initialFormData = elements.reduce((acc, field) => {
    if (field.type !== 'checkbox') {
      acc[field.name] = field.defaultValue || ''
    } else {
      acc[field.name] = field.defaultValue || false
    }
    return acc
  }, {})

  const [formData, setFormData] = useState(initialFormData)

  // Update form data when user data is fetched
  useEffect(() => {
    if (data?.user) {
      const user = data.user
      setFormData({
        username: user.username || '',
        firstName: user.profile?.firstName || 'not set',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        password: '', // Don't populate password field
        isVerified: user.isVerified || false,
        isOnline: user.isOnline || false, // You might need to add this to your user model
      })
    }
  }, [data])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form data to update:', formData)
    // TODO: Add update user mutation here later
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <span className='loading loading-spinner loading-lg text-white'></span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='bg-red-500 text-white p-4 rounded'>
          Error loading user data:{' '}
          {error?.data?.message || 'Something went wrong'}
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className='py-10'>
        <p className='text-3xl text-white text-center'>User Dashboard</p>
      </section>

      <section>
        <div className='grid grid-cols-2'>
          <div>
            <p className='text-2xl text-white text-center mb-3'>User Info</p>
            <div className='max-w-[700px] mx-auto'>
              <form onSubmit={handleSubmit} className=''>
                <div className='grid grid-cols-2 gap-5'>
                  {/* TEXT FIELDS */}
                  {elements
                    .filter(
                      (item) => item.type === 'text' || item.type === 'password'
                    )
                    .map((item, i) => {
                      return (
                        <div key={item.id}>
                          <label className='block text-white text-sm mb-1'>
                            {item.placeholder}
                          </label>
                          <FormTextInput
                            key={item.id}
                            name={item.name}
                            type={item.type}
                            value={formData[item.name] || ''}
                            placeholder={item.placeholder}
                            className='input w-full mb-2'
                            onChange={handleChange}
                          />
                        </div>
                      )
                    })}
                </div>

                {/* CHECKBOXES */}
                <div className='flex gap-5 my-4'>
                  {elements
                    .filter((item) => item.type === 'checkbox')
                    .map((item, i) => {
                      return (
                        <label
                          key={item.id}
                          htmlFor={item.name}
                          className='flex items-center gap-2'
                        >
                          <input
                            id={item.name}
                            name={item.name}
                            type='checkbox'
                            checked={formData[item.name] || false}
                            onChange={handleChange}
                            className='checkbox checkbox-secondary'
                          />
                          <span className='text-white'>{item.text}</span>
                        </label>
                      )
                    })}
                </div>

                <div className='flex justify-end'>
                  <button
                    type='submit'
                    className='bg-rose-500 text-white text-2xl p-2 rounded hover:bg-rose-600 transition-colors'
                  >
                    Update
                  </button>
                </div>
              </form>
              <div className=' mt-10'>
                <Link
                  to={'/'}
                  className='p-4 border block w-full text-center border-rose-500 text-white text-2xl p-2 rounded hover:bg-rose-600 transition-colors'
                >
                  Home
                </Link>
              </div>
            </div>
          </div>

          <div>
            {/* Debug info - remove this later */}
            {/* <div className='max-w-[400px] mx-auto'>
              <p className='text-white text-xl mb-3'>Debug Info</p>
              <pre className='text-green-400 text-sm bg-gray-800 p-3 rounded overflow-auto max-h-96'>
                {JSON.stringify(data?.user, null, 2)}
              </pre>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserDash
