import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import clsx from 'clsx'
import { Icons } from './icons'

const dropdownItems = [
  { text: 'Account', icon: Icons.user },
  { text: 'Sign out', icon: Icons.logOut },
]

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div>Workspace name or search input</div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2.5 mr-8 text-md">
            {dropdownItems?.map((item, index) => (
              <>
                <DropdownMenuItem
                  className={clsx(['flex gap-3 items-center'], {
                    'hover:text-red-500 text-red-500': index === 1,
                  })}
                >
                  <item.icon className=" h-4 w-4 opacity-70" />
                  <>{item.text}</>
                </DropdownMenuItem>
              </>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Header
