'use client'

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
import { useRouter } from 'next/navigation'
import useCurrentUserStore from '@/stores/user'
import { useLogout } from '@/api/mutations/auth'
import useSessionStore from '@/stores/session'
import { LogoutError } from '@/api/requests/auth'
import { useToast } from './ui/use-toast'

const dropdownItems = [
  { text: 'Account', icon: Icons.user },
  { text: 'Sign out', icon: Icons.logOut },
]

const Header = () => {
  const { toast } = useToast()
  const router = useRouter()
  const user = useCurrentUserStore((user) => user?.data)
  const session = useSessionStore()

  const { mutate: logout } = useLogout({
    onSuccess: async () => {
      await fetch('/api/logout', { method: 'POST' })
      // deleteSession()
      router.replace('/login', { scroll: false })
    },
    onError: async (err) => {
      // deleteSession()
      console.log(err)
      const error = err as LogoutError
      if (error.code) {
        await fetch('/api/logout', { method: 'POST' })
        router.replace('/login', { scroll: false })
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong.',
          variant: 'destructive',
        })
      }
    },
  })

  const handleLogout = () => {
    session.setLoggingOut(true)
    logout(null)
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <div>Workspace name or search input</div>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />
        {/* {session?.accessToken} */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src={user?.avatarUrl ?? ''} />
                <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2.5 mr-8 text-md">
              {dropdownItems?.map((item, index) => (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      if (index === 0) {
                        router.push(`personal-settings/general`)
                      }
                      if (index === 1) {
                        handleLogout()
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
            <div className="text-[0.9rem] font-medium">{user?.name}</div>
            <div className="text-sm">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
