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
import { deleteSession } from '@/app/actions'
import useCurrentUserStore from '@/stores/user'
import { useLogout } from '@/api/mutations/auth'
import WorkspaceSelect from './WorkspaceSelect'

const dropdownItems = [
  { text: 'Account', icon: Icons.user },
  { text: 'Sign out', icon: Icons.logOut },
]

const Header = () => {
  const router = useRouter()
  const user = useCurrentUserStore((user) => user?.data)

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      deleteSession()
      router.replace('/login', { scroll: false })
    },
    onError: (err) => {
      // TODO: error toast
      console.log(err)
    },
  })

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
                        logout({ id: true })
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
