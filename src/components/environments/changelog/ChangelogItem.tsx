'use client'

import React, { useState } from 'react'

import dayjs from 'dayjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import clsx from 'clsx'

interface Props {
  secretKey: string
  newValue?: string
  oldValue?: string
}

const ChangelogItem: React.FC<Props> = ({ secretKey, newValue, oldValue }) => {
  const [hidden, setHidden] = useState(true)

  const toggleHide = () => setHidden(!hidden)

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
                  <Button
                    size={'sm'}
                    variant={'ghost'}
                    className="opacity-80 hover:opacity-100"
                    onClick={() => toggleHide()}
                  >
                    {hidden ? (
                      <Icons.eye className="h-4 w-4" />
                    ) : (
                      <Icons.eyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{hidden ? 'Show values' : 'Hide values'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {/* // Secrets changes */}
        <div className="ml-[3.75rem] bg-red-400x">
          <div className="w-full h-fit bg-red-400X my-2 text-sm rounded-md border border-input">
            <div className="flex flex-row gap-2 items-center">
              <div
                className={clsx(['h-10 flex gap-3.5 px-3.5 items-center'], {
                  'w-1/2': (oldValue && !newValue) || (!oldValue && newValue),
                  'w-1/3': !((oldValue && !newValue) || (!oldValue && newValue)),
                })}
              >
                <input
                  readOnly
                  className="w-full opacity-80 font-bold outline-none bg-transparent"
                  value={secretKey}
                />
              </div>

              {oldValue && (
                <div
                  className={clsx(['h-10 pr-2 flex gap-3.5 items-center'], {
                    'w-1/2': !newValue,
                    'w-1/3': newValue,
                  })}
                >
                  <div className="px-2 h-full flex justify-center items-center bg-red-600/5 dark:bg-red-600/10 border-red-600/40 dark:border-red-600/20 border-x-[1.5px]">
                    <Icons.minus className="opacity-70 h-3.5 w-3.5 text-red-600" />
                  </div>

                  {hidden ? (
                    <span className="block opacity-85">•••••••••••</span>
                  ) : (
                    <input
                      readOnly
                      className="w-full text-red-600 dark:text-red-600/90 outline-none bg-transparent"
                      value={oldValue}
                    />
                  )}
                </div>
              )}

              {newValue && (
                <div
                  className={clsx(['h-10 flex gap-3.5 items-center'], {
                    'w-1/2': !oldValue,
                    'w-1/3': oldValue,
                  })}
                >
                  <div className="px-2 h-full flex justify-center items-center bg-green-600/5 dark:bg-green-600/10 border-green-600/40 dark:border-green-600/20 border-x-[1.5px]">
                    <Icons.minus className="opacity-70 h-3.5 w-3.5 text-green-600" />
                  </div>
                  {hidden ? (
                    <span className="block opacity-85 font-bold ">•••••••••••</span>
                  ) : (
                    <input
                      readOnly
                      className="w-full text-green-600 dark:text-green-600/90 outline-none bg-transparent"
                      value={newValue}
                    />
                  )}
                </div>
              )}
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
