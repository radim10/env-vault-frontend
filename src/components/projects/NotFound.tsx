import React from 'react'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import Link from 'next/link'

interface Props {
  title: string
  description: string
  btnText: string
  link: string
}

const NotFound: React.FC<Props> = ({ title, description, link, btnText }) => {
  return (
    <div>
      <div className="flex items-center justify-center mt-36">
        <div className="flex flex-col items-center gap-2">
          <div>
            <Icons.searchSlash className="h-20 w-20 opacity-30" />
          </div>
          <div className="text-center">
            <span className="text-lg font-bold opacity-85">{title}</span>
            <div className="my-1">{description}</div>
            <div className="mt-5">
              <Link href={link}>
                <Button>{btnText}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
