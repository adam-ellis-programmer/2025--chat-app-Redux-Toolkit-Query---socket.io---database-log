import { sampleMessages } from '../../temp data/messageData'

const ChatLogsPage = () => {
  return (
    <div className='min-h-screen'>
      <section className='p-10'>
        <h1 className='text-3xl text-white text-center capitalize'>
          admin chat logs page
        </h1>
      </section>
      {/*  */}
      <section>
        <div className='grid md:grid-cols-[500px_1fr] gap-4'>
          <div className=''>
            <p className='text-white text-3xl text-center capitalize'>
              chat room
            </p>
            {/* room selector wrapper */}
            <div className='mt-20 text-white'>
              {/* room div */}
              <article className=' shadow-2xl p-10 rounded-2xl mb-7 cursor-pointer'>
                <p className='text-2xl'>travel room</p>
                <p className='mt-1'>05/05/2025</p>
                <p className='mt-1 capitalize'>3 participants</p>
              </article>

              <article className=' shadow-2xl p-10 rounded-2xl mb-7 cursor-pointer'>
                <p className='text-2xl'>managers meeting</p>
                <p className='mt-1'>05/05/2025</p>
                <p className='mt-1 capitalize'>6 participants</p>
              </article>
            </div>
          </div>
          <div className=''>
            <p className='text-center  text-white text-3xl capitalize'>
              chat logs
            </p>
            <div className='mt-10  max-w-[90%] mx-auto rounded bg-white '>
              <div className=''>
                <p className='capitalize text-center text-2xl p-4 shadow-2xl'>
                  logs for travel room - 05/05/2025
                </p>
                <ul className='h-150 overflow-scroll'>
                  {sampleMessages.map((item, i) => {
                    return (
                      <li key={i} className='mb-7 shadow-md p-5'>
                        <div className='mb-1'>
                          <span className='text-rose-500 capitalize'>
                            from:
                          </span>
                          <p className='text-[1rem]'>{item.username}</p>
                        </div>
                        <div className='mb-1'>
                          <span className='text-rose-500 capitalize'>
                            message:
                          </span>
                          <p className='text-[1rem]'>{item.content}</p>
                        </div>
                        <div className='mb-1'>
                          <span className='text-rose-500 capitalize'>
                            date / time:
                          </span>
                          <p className='text-[1rem]'>
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ChatLogsPage
