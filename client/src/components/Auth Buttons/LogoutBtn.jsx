import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useLogoutMutation } from '../../store/authApiSlice.js'
import { logout as clearCredentials } from '../../store/authSlice.js'

const LogoutBtn = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // RTK Query logout mutation
  const [logout, { isLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      // Call logout mutation (clears cookie on backend)
      await logout().unwrap()

      // Clear Redux state
      dispatch(clearCredentials())

      console.log('Logout successful')

      // Redirect to home page
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)

      // Even if logout fails, clear local state and redirect
      // (cookie might already be expired, etc.)
      dispatch(clearCredentials())
      navigate('/')
    }
  }

  return (
    <button
      type='button'
      onClick={handleLogout}
      disabled={isLoading}
      className='bg-rose-800 text-white cursor-pointer text-2xl p-3 w-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {isLoading ? (
        <>
          <span className='loading loading-spinner loading-sm'></span>
          Logging out...
        </>
      ) : (
        'Logout'
      )}
    </button>
  )
}

export default LogoutBtn
