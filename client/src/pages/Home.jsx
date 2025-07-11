import React from 'react'
import {
  EmailRegister,
  EmailSignIn,
  GoogleSignIn,
  LinkedInSignIn,
} from '../components/index'
const Home = () => {
  return (
    <div className=''>
      <section className='pt-30'>
        <h1 className='text-white text-center text-6xl'>Chatter App</h1>
      </section>

      {/* register / sign in  section*/}
      <section className='mt-10'>
        <div className=' max-w-[800px] m-auto'>
          <p className='text-center text-2xl text-white mb-10'>
            Already a member?
          </p>
          <EmailSignIn />
          <GoogleSignIn />
          <LinkedInSignIn />
        </div>
      </section>

      {/* register section */}
      <section className='mt-20'>
        <div className='max-w-[800px] mx-auto'>
          <p className='text-center text-2xl text-white mb-10'>
            Not a member yet?
          </p>
          <EmailRegister />
        </div>
      </section>
    </div>
  )
}

export default Home
