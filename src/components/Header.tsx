'use client'

import React, { useContext } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import clsx from 'clsx'
import { Icons } from './icons'
import { ThemeToggle } from './ui/theme-toggle'
import { AuthContext } from './SessionProvider'

const dropdownItems = [
  { text: 'Account', icon: Icons.user },
  { text: 'Sign out', icon: Icons.logOut },
]

const Header = () => {
  const session = useContext(AuthContext)

  const handleSignOut = async () => {
    await fetch('/api/logout', { method: 'POST' })
  }

  console.log(session)

  return (
    <div className="flex flex-row justify-between items-center">
      <div>Workspace name or search input</div>
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />
        {session?.accessToken}
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
                  onClick={() => {
                    if (index === 1) {
                      handleSignOut()
                    }
                  }}
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
