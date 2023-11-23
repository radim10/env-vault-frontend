'use client'

import { useContext } from 'react'
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
import { useRouter } from 'next/navigation'
import sessionStore from '@/stores/session'
import { deleteSession } from '@/app/actions'

const dropdownItems = [
  { text: 'Account', icon: Icons.user },
  { text: 'Sign out', icon: Icons.logOut },
]

const Header = () => {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const session = sessionStore?.getState().data

  const handleSignOut = async () => {
    deleteSession()
    router.replace('/login', { scroll: false })
  }

  console.log(auth)

  return (
    <div className="flex flex-row justify-between items-center">
      <div>Workspace name or search input</div>
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />
        {session?.accessToken}
        <div className="flex items-center gap-2">
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
          <div className="flex flex-col">
            <div className="text-[0.9rem] font-medium">{auth?.name}</div>
            <div className="text-sm">{auth?.email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
