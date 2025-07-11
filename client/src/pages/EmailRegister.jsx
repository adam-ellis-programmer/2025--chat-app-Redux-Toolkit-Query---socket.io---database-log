import React from 'react'

import { RegisterForm } from '../components/index'
// use the data loaders
const EmailRegister = () => {
  return (
    <section>
      <section className='pt-30'>
        <h1 className='text-white text-center text-6xl'>Chatter App</h1>
        <p className='text-white text-center text-2xl mt-2'>
          Email Register Page
        </p>
      </section>
      <section className='mt-10'>
        <RegisterForm />
      </section>
    </section>
  )
}

export default EmailRegister
