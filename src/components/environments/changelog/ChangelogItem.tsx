import React from 'react'

import dayjs from 'dayjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const ChangelogItem = (props: {}) => {
  return (
    <>
      <div>
        <div className="w-full flex justify-between items-center gap-3">
          <div className="flex flex-row gap-5 bg-red-400X items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0">
              <div>
                <div className="font-bold text-[0.97rem]">dimak00</div>
                <div className="-mt-0.5 text-[0.97rem]">Modified secrets</div>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button size={'sm'} variant={'ghost'} className="opacity-80 hover:opacity-100">
                    <Icons.undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Revert this change</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button size={'sm'} variant={'ghost'} className="opacity-80 hover:opacity-100">
                    <Icons.eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show values</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {/* // Secrets changes */}

        <div className="ml-[3.75rem] bg-red-400x">
          <div className="w-full h-fit bg-red-400X my-2 text-sm">
            <div className="flex flex-row gap-2">
              <div className="w-1/2 h-10 flex gap-3.5 px-3.5 items-center rounded-md border border-input">
                {/* <Icons.keyRound className="opacity-70 h-3.5 w-3.5" /> */}
                <span className="block opacity-85 font-bold">SECRET_KEY</span>
              </div>

              <div className="w-1/2 h-10 flex gap-3.5 px-3.5 items-center rounded-md border border-green-600/90 dark:border-green-600/70">
                <Icons.plus className="opacity-70 h-3.5 w-3.5 text-green-600" />
                <span className="block opacity-85 font-bold ">•••••••••••</span>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex items-center text-[0.90rem] opacity-80">
              <span className="block">{`${dayjs().format('HH:mm')} (${dayjs().fromNow()})`}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangelogItem
