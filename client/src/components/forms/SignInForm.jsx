import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { useLoginMutation } from '../../store/authApiSlice.js'
import { setCredentials } from '../../store/authSlice.js'
import FormTextInput from '../inputs/FormTextInput'

const formfields = [
  {
    id: 1,
    name: 'email',
    placeholder: 'Enter Email',
    type: 'email',
    default: 'test@example.com',
  },
  {
    id: 2,
    name: 'password',
    placeholder: 'Enter Password',
    type: 'password',
    default: 'Password123',
  },
]

const SignInForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // RTK Query login mutation
  const [login, { isLoading, error }] = useLoginMutation()

  // Initialize form data from formfields default values
  const initialFormData = formfields.reduce((acc, field) => {
    acc[field.name] = field.default
    return acc
  }, {})

  const [formData, setFormData] = useState(initialFormData)
  const [validationError, setValidationError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')

    // Basic validation
    if (!formData.email || !formData.password) {
      setValidationError('Please fill in all fields')
      return
    }

    try {
      // Login user with RTK Query
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap()

      // User is automatically logged in (cookie set by backend)
      // Update Redux state
      dispatch(setCredentials(result.user))

      console.log('Login successful:', result.message)

      // Navigate to chat create page
      navigate('/chat/create')
    } catch (err) {
      console.error('Login failed:', err)
      setValidationError(err?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Error display */}
      {(error || validationError) && (
        <div className='bg-red-500 text-white p-3 rounded mb-4'>
          {validationError || error?.data?.message || 'Login failed'}
          {error?.data?.errors && (
            <ul className='mt-2 list-disc list-inside'>
              {error.data.errors.map((err, index) => (
                <li key={index}>{err.msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className='grid grid-cols-2 gap-3'>
        {formfields.map((item, i) => {
          return (
            <label key={i} className='' htmlFor={i}>
              <p className='text-white text-[1.2rem] mb-2'>
                {item.placeholder}
              </p>
              <FormTextInput
                key={i}
                id={i}
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                className='input w-full mb-2'
                value={formData[item.name]}
                onChange={handleChange}
                required
              />
            </label>
          )
        })}
      </div>

      <div className='flex flex-col w-[200px]'>
        <button
          type='submit'
          disabled={isLoading}
          className='btn btn-outline text-white disabled:opacity-50'
        >
          {isLoading ? (
            <>
              <span className='loading loading-spinner loading-sm'></span>
              Signing In...
            </>
          ) : (
            'Sign In!'
          )}
        </button>

        <div className='mt-4 text-white'>
          <p className='capitalize text-[1.1rem]'>not a member?</p>
          <Link className='underline cursor-pointer' to='/'>
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  )
}

export default SignInForm
