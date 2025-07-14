import { useRef, useState, useEffect } from 'react'
import { sampleMessages } from '../../temp data/messageData'
import { FaArrowAltCircleUp } from 'react-icons/fa'

const ChatLogWindow = () => {
  const chatLogRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  //  *** old scroll top ***
  //   const scrollToTop = () => {
  //     if (chatContainerRef.current) {
  //       chatContainerRef.current.scrollTop = 0
  //     }
  //   }

  const handleScrollTop = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const handleScroll = () => {
    if (chatLogRef.current) {
      const scrollTop = chatLogRef.current.scrollTop
      //   console.log(scrollTop)
      setShowScrollButton(scrollTop > 100)
    }
  }

  useEffect(() => {
    const chatLogElement = chatLogRef.current
    if (chatLogElement) {
      chatLogElement.addEventListener('scroll', handleScroll)
      return () => chatLogElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className='mt-10 max-w-[90%] mx-auto rounded bg-white relative'>
      <div className=''>
        <p className='capitalize text-center text-2xl p-4 shadow-2xl'>
          logs for travel room - 05/05/2025 - start: 18:18:18
        </p>
        <ul ref={chatLogRef} className='h-150 overflow-scroll'>
          {sampleMessages.map((item, i) => {
            return (
              <li key={i} className='mb-7 shadow-md p-5'>
                <div className='mb-1'>
                  <span className='text-rose-500 capitalize'>from:</span>
                  <p className='text-[1rem]'>{item.username}</p>
                </div>
                <div className='mb-1'>
                  <span className='text-rose-500 capitalize'>message:</span>
                  <p className='text-[1rem]'>{item.content}</p>
                </div>
                <div className='mb-1'>
                  <span className='text-rose-500 capitalize'>date / time:</span>
                  <p className='text-[1rem]'>
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      {showScrollButton && (
        <FaArrowAltCircleUp
          onClick={handleScrollTop}
          className='text-7xl absolute bottom-5 right-5 cursor-pointer'
        />
      )}
    </div>
  )
}

export default ChatLogWindow
