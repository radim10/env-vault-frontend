import React, { useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Icons } from '../icons'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface Props {
  link: string
  index: number // for dev
  //

  name: string
  locked: boolean
  secretsCount: number

  onLock: () => void
}

const dropdownItems = [
  { label: 'Lock', icon: Icons.lock },
  { label: 'Unlock', icon: Icons.unlock },
  { label: 'Rename', icon: Icons.pencil },
  { label: 'Delete', icon: Icons.trash },
]

 const SingleListEnvironment: React.FC<Props> = ({
  index,
  link,
  name,
  locked,
  secretsCount,

  onLock,
}) => {
  const [dropdownOpened, setDropdownOpened] = useState(false)

  return (
    <Link href={link}>
      <div className="pb-2.5 py-2.5 md:py-1.5 pl-5 md:pl-6 pr-2 md:pr-4 cursor-pointer border-2 dark:border-gray-800 transition hover:dark:shadow-xl hover:dark:shadow-primary/20 rounded-md hover:dark:border-primary hover:border-primary hover:scale-[101%] ease duration-200">
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 w-[90%] bg-red-700X">
            <div className="w-full md:w-[50%] bg-red-800X flex items-center gap-2 md:gap-4">
              {/* // */}
              <div
                className={clsx(['h-3 w-3 rounded-full bg-primary'], {
                  'bg-red-600 dark:bg-red-800': index === 0,
                })}
              />
              {/* {} */}
              <div className="flex flex-row gap-2.5 items-center ">
                <span className="font-semibold">{name}</span>
                {locked === true && (
                  <div className="opacity-80">
                    <Icons.lock className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
            {/* // */}
            <div className="w-full md:w-[45%] bg-green-800X flex flex-row-reverse md:flex-row items-center gap-0 md:gap-3 text-gray-300 text-[0.9rem]">
              <div className="w-full">
                <span>
                  {secretsCount !== 0 ? secretsCount : 'No'}{' '}
                  {secretsCount === 1 ? 'secret' : 'secrets'}
                </span>
              </div>
              {/* //  */}

              {/* // badge */}
              <div className="w-44 bg-green-800X">
                {/* // Green = developnent, orange = staging, blue = Production ???  */}
                {index !== 3 ? (
                  <Badge variant="default" className="bg-green-800 text-gray-200 text-[0.725rem]">
                    Developnent
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-blue-800 text-gray-200 text-[0.725rem]">
                    Production
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* // DropdownMenu */}
          <SingleEnvironmentDropdown locked={locked} onLock={onLock} />
        </div>
      </div>
    </Link>
  )
}

interface DropdownProps {
  locked: boolean
  onLock: () => void
}

const SingleEnvironmentDropdown: React.FC<DropdownProps> = ({ locked, onLock }) => {
  const [dropdownOpened, setDropdownOpened] = useState(false)

  return (
    <DropdownMenu onOpenChange={setDropdownOpened} open={dropdownOpened}>
      <DropdownMenuTrigger>
        <Button
          variant={'ghost'}
          size={'sm'}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Icons.moreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10 w-[180px] mt-0 shadow-lg shadow-primary-foreground">
        {dropdownItems
          .filter(({ label }) => (locked ? label !== 'Lock' : label !== 'Unlock'))
          ?.map((item, index) => (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                if (item.label === 'Lock' || item.label === 'Unlock') {
                  setDropdownOpened(false)
                  onLock()
                }
              }}
              className={clsx(['flex items-center gap-3 px-3.5 py-2'], {
                'hover:text-red-500 text-red-500 dark:hover:text-red-500 dark:text-red-500':
                  item.label === 'Delete',
              })}
            >
              <item.icon className={clsx(['h-4 w-4 opacity-70'])} />
              <div className="">{item.label}</div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SingleListEnvironment
