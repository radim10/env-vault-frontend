import React from 'react'
import { Icons } from './icons'
import { Button } from './ui/button'
import Link from 'next/link'

interface Props {
  link?: {
    text: string
    href: string
  }
}

const Error: React.FC<Props> = ({ link }) => {
  return (
    <div>
      <div className="flex items-center justify-center mt-36">
        <div className="flex flex-col items-center gap-2">
          <div>
            <Icons.serverCrash className="h-20 w-20 opacity-30" />
          </div>
          <div className="text-center">
            <span className="text-lg font-bold opacity-85">Something went wrong</span>
            <div className="my-1">Our team is working on it right now</div>
            {link && (
              <div className="mt-5">
                <Link href={link.href}>
                  <Button>{link.text}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error
