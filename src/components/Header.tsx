'use client'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
import clsx from 'clsx'
import { Icons } from './icons'
import { ThemeToggle } from './ui/theme-toggle'
import { useParams, useRouter } from 'next/navigation'
import useCurrentUserStore from '@/stores/user'
import { useLogout } from '@/api/mutations/auth'
import useSessionStore from '@/stores/session'
import { LogoutError } from '@/api/requests/auth'
import { useToast } from './ui/use-toast'
import Link from 'next/link'

const dropdownItems = [
  { text: 'Support', icon: Icons.helpCircle },
  { text: 'Personal settings', icon: Icons.user },
  { text: 'Sign out', icon: Icons.logOut },
]

const Header = () => {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()

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
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center">
              <Avatar className="w-10 h-10 border-[2.5px] dark:border-gray-800 border-gray-200">
                <AvatarImage src={user?.avatarUrl ?? ''} />
                <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mt-0 mr-10 text-md">
              <div className="flex flex-col px-2 pt-1">
                <div className="text-[0.85rem] font-medium">{user?.name}</div>
                <div className="text-[0.81rem] text-muted-foreground">{user?.email}</div>
              </div>
              <div className="mt-2">
                {dropdownItems?.map((item, index) => (
                  <>
                    {index === 2 && <DropdownMenuSeparator className="my-1" />}
                    {index !== 1 && (
                      <DropdownMenuItem
                        onClick={() => {
                          if (index === 2) {
                            handleLogout()
                          }
                        }}
                        className={clsx(
                          ['flex gap-2 items-center text-[0.825rem] cursor-pointer'],
                          {
                            'hover:text-red-500 text-red-500 dark:text-red-500 dark:hover:text-red-500':
                              index === 2,
                          }
                        )}
                      >
                        <item.icon className=" h-3.5 w-3.5 opacity-70" />
                        <>{item.text}</>
                      </DropdownMenuItem>
                    )}

                    {index === 1 && (
                      <DropdownMenuItem className={clsx([''])}>
                        <Link
                          href={`/workspace/${params?.workspace}/personal-settings/general`}
                          className="flex gap-2 items-center text-[0.825rem] cursor-pointer"
                        >
                          <item.icon className=" h-3.5 w-3.5 opacity-70" />
                          <>{item.text}</>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <div className="flex flex-col"> */}
          {/*   <div className="text-[0.9rem] font-medium">{user?.name}</div> */}
          {/*   <div className="text-sm">{user?.email}</div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default Header
