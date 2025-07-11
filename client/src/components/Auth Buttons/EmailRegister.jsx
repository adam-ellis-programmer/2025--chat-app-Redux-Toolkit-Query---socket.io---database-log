import React from 'react'
import { useNavigate } from 'react-router'

const EmailRegister = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('email-register')
  }
  return (
    <button
      onClick={handleClick}
      className='bg-white w-full text-2xl p-5 cursor-pointer rounded'
    >
      Register
    </button>
  )
}

export default EmailRegister
