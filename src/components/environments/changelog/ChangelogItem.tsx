import React from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const ChangelogItem = (props: {}) => {
  return (
    <>
      <div>
        <div className="flex flex-row gap-5 bg-red-400X items-center">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0">
            <div>
              <div className="font-bold text-[0.97rem]">dimak00</div>
              <div className="-mt-0.5 text-[0.97rem]">Locked environment</div>
            </div>
          </div>
        </div>

        <div className="ml-[3.75rem] mt-1">
          <div className="flex items-center text-[0.90rem] opacity-80">
            <span className="block">{`${dayjs().format('HH:mm')} (${dayjs().fromNow()})`}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangelogItem
