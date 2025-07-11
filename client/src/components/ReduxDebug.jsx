// src/components/ReduxDebug.jsx
import React from 'react'
import { useSelector } from 'react-redux'

const ReduxDebug = () => {
  // Try to get the entire state first
  const entireState = useSelector((state) => state)

  // Try different possible paths for user data
  const authUser = useSelector((state) => state.auth?.user)
  const directUser = useSelector((state) => state.user)
  const authUserData = useSelector((state) => state.auth?.userData)
  const authCurrentUser = useSelector((state) => state.auth?.currentUser)

  return (
    <div className='fixed top-0 left-0 bg-blue-900 bg-opacity-90 text-white p-4 m-4 rounded z-50 max-w-md max-h-96 overflow-auto'>
      <h3 className='font-bold text-lg mb-2'>Redux Debug Info</h3>
      <div className='text-xs space-y-2'>
        <div>
          <strong>Redux Store Keys:</strong>
          <pre>{JSON.stringify(Object.keys(entireState), null, 2)}</pre>
        </div>

        <div>
          <strong>state.auth:</strong>
          <pre>{JSON.stringify(entireState.auth || 'undefined', null, 2)}</pre>
        </div>

        <div>
          <strong>state.auth.user:</strong>
          <pre>{JSON.stringify(authUser || 'undefined', null, 2)}</pre>
        </div>

        <div>
          <strong>state.user:</strong>
          <pre>{JSON.stringify(directUser || 'undefined', null, 2)}</pre>
        </div>

        <div>
          <strong>state.auth.userData:</strong>
          <pre>{JSON.stringify(authUserData || 'undefined', null, 2)}</pre>
        </div>

        <div>
          <strong>state.auth.currentUser:</strong>
          <pre>{JSON.stringify(authCurrentUser || 'undefined', null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default ReduxDebug
