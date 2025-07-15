import React from 'react'
import { useNavigate } from 'react-router'

const BackBtn = ({ route }) => {
  const navigate = useNavigate()
  return (
    <button
      className='text-white bg-rose-700 text-2xl p-3 rounded cursor-pointer'
      onClick={() => navigate(route)}
    >
      Back
    </button>
  )
}

export default BackBtn
