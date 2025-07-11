import React from 'react'
import { SignInForm } from '../components/index'


const EmailSignIn = () => {
  return (
    <section>
      <section className='pt-30'>
        <h1 className='text-white text-center text-6xl'>Chatter App</h1>
        <p className='capitalize text-2xl text-white text-center mt-2'>email sign in</p>
      </section>
      <section className='max-w-[800px] mx-auto mt-10'>
        {<SignInForm />}
      </section>
    </section>
  )
}

export default EmailSignIn
