import React from 'react'
import { useNavigate } from 'react-router'
const EmailSignIn = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    ///...
    navigate('/email-sign-in')
    console.log('clcked ')
  }
  return (
    <button
      onClick={handleClick}
      className='btn bg-white text-[1.2rem] text-black border-[#e5e5e5] w-full mb-4'
    >
      <svg
        aria-label='Email icon'
        width='26'
        height='26'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
      >
        <g
          strokeLinejoin='round'
          strokeLinecap='round'
          strokeWidth='2'
          fill='none'
          stroke='black'
        >
          <rect width='20' height='16' x='2' y='4' rx='2'></rect>
          <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
        </g>
      </svg>
      Login with Email
    </button>
  )
}

export default EmailSignIn
