import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { useRegisterMutation } from '../../store/authApiSlice.js'
import { setCredentials } from '../../store/authSlice.js'
import FormTextInput from '../inputs/FormTextInput'

// Keep your exact formfields structure with default values for quick testing
const formfields = [
  {
    id: 1,
    name: 'userName',
    placeholder: 'Enter User Name',
    type: 'text',
    default: 'testuser123',
  },
  {
    id: 2,
    name: 'firstName',
    placeholder: 'Enter First Name',
    type: 'text',
    default: 'John',
  },
  {
    id: 3,
    name: 'lastName',
    placeholder: 'Enter Last Name',
    type: 'text',
    default: 'Doe',
  },
  {
    id: 4,
    name: 'email',
    placeholder: 'Enter Email',
    type: 'email',
    default: 'test@example.com',
  },
  {
    id: 5,
    name: 'password',
    placeholder: 'Enter Password',
    type: 'password',
    default: 'Password123',
  },
  {
    id: 6,
    name: 'confirm',
    placeholder: 'Confirm Password',
    type: 'password',
    default: 'Password123',
  },
]

const RegisterForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // prettier-ignore
  const [register, { isLoading, error, data, isSuccess }] = useRegisterMutation()

  // Initialize form data from formfields default values
  const initialFormData = formfields.reduce((acc, field) => {
    acc[field.name] = field.default
    return acc
  }, {})

  const [formData, setFormData] = useState(initialFormData)
  console.log(formData)
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

    // Client-side validation
    if (formData.password !== formData.confirm) {
      setValidationError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return
    }

    try {
      // Register user with RTK Query
      const result = await register({
        username: formData.userName, // Backend expects 'username'
        email: formData.email,
        password: formData.password,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      }).unwrap()

      // User is automatically logged in (cookie set by backend)
      // Update Redux state
      dispatch(setCredentials(result.user))

      console.log('Registration successful:', result.message)

      // Navigate to chat create page as requested
      navigate('/chat/create')
    } catch (err) {
      console.error('Registration failed:', err)
      setValidationError(err?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-[800px] mx-auto'>
      {/* Error display */}
      {(error || validationError) && (
        <div className='bg-red-500 text-white p-3 rounded mb-4'>
          {validationError || error?.data?.message || 'Registration failed'}
          {error?.data?.errors && (
            <ul className='mt-2 list-disc list-inside'>
              {error.data.errors.map((err, index) => (
                <li key={index}>{err.msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className='grid grid-cols-3 gap-4'>
        {formfields.map((item, i) => {
          console.log(formData[item.name])
          return (
            <label key={i} className='' htmlFor={i}>
              <p className='text-white text-[1.2rem] mb-2'>
                {item.placeholder}
              </p>
              <FormTextInput
                id={i}
                name={item.name} // Important: use item.name for controlled input
                type={item.type}
                placeholder={item.placeholder}
                className='input w-full mb-2 cursor-default'
                value={formData[item.name]} // Controlled input
                onChange={handleChange} // Handle changes
                required={
                  item.name === 'userName' ||
                  item.name === 'email' ||
                  item.name === 'password'
                }
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
              Registering...
            </>
          ) : (
            'Register!'
          )}
        </button>

        <div className='mt-4 text-white'>
          <p className='capitalize'>already a member?</p>
          <Link
            to='/email-sign-in'
            className='capitalize cursor-pointer underline'
          >
            sign in
          </Link>
        </div>
      </div>
    </form>
  )
}

export default RegisterForm

/* 
WHAT CHANGED:
✅ Kept your exact formfields array structure
✅ Kept default values for quick testing
✅ Added RTK Query integration with useRegisterMutation
✅ Added controlled inputs with useState
✅ Added form submission handling
✅ Added error handling and loading states
✅ Added auto-login after registration
✅ Added navigation to /chat/create on success

WHAT STAYED THE SAME:
✅ Dynamic form field rendering
✅ Default values for quick testing
✅ Grid layout and styling
✅ FormTextInput component usage
✅ Link to sign in page

TESTING:
1. Form loads with default values pre-filled
2. You can quickly test registration without typing
3. On success: auto-login + redirect to /chat/create
4. Errors displayed nicely above the form
*/
