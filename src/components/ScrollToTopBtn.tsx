'use client'

import { useEffect, useState } from 'react'
import { useWindowScroll } from 'react-use'
import { Icons } from './icons'

const ScrollToTopButton = () => {
  const { y } = useWindowScroll()

  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    if (y < 100 && scrolling) {
      setScrolling(false)
    }
  }, [y, scrolling])

  return (
    <>
      {y > 100 && !scrolling && (
        <div className="fixed right-4 bottom-4 ease-in-out animate-in slide-in-from-bottom duration-300 z-20">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setScrolling(true)
            }}
            className="ease duration-200 backdrop-blur-xl rounded-md p-3 flex items-center justify-center border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
          >
            <Icons.arrowUp className="w-6 h-6 opacity-80" />
          </button>
        </div>
      )}
    </>
  )
}

export default ScrollToTopButton
