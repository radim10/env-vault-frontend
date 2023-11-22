'use client'

import clsx from 'clsx'
import React from 'react'
import Link from 'next/link'
import { Icons } from './icons'
import { Separator } from './ui/separator'
import WorkspaceSelect from './WorkspaceSelect'
import { usePathname, useParams } from 'next/navigation'
import { useLockBodyScroll, useToggle } from 'react-use'

const navItems = [
  { label: 'Projects', href: 'projects', icon: Icons.folder },
  { label: 'Activity', href: 'activity', icon: Icons.users },
  { label: 'Users', href: 'users/workspace', icon: Icons.users },
  { label: 'Tokens', href: 'tokens/cli', icon: Icons.keyRound },
  { label: 'Settings', href: 'settings/workspace', icon: Icons.settings },
]

const helpNavItems = [
  { label: 'Docs', href: 'docs', icon: Icons.book },
  { label: 'SDKs', href: 'docs', icon: Icons.code },
  { label: 'Community', href: 'Community', icon: Icons.mic2 },
]

const Sidebar = () => {
  const [opened, setOpened] = React.useState(false)
  const [scrollLocked, setSrcollLocked] = useToggle(false)

  const pathname = usePathname()
  const params = useParams()

  const toggle = () => {
    setSrcollLocked(!opened)
    setOpened(!opened)
  }

  useLockBodyScroll(scrollLocked)

  return (
    <div className="h-full md:border-r-[1.2px]  border-b-[1.2px] dark:border-gray-800 bg-background z-50">
      <div className="md:pt-10 pt-4 pb-4 md:pb-0 md:px-9 px-6">
        <div className="hidden md:block">LOGO</div>
        <button className="block md:hidden" onClick={toggle}>
          {opened ? <Icons.x /> : <Icons.menu />}
        </button>
      </div>
      <div
        className={clsx(
          [
            'shadow-lg dark:shadow-gray-900 md:shadow-none w-screen md:w-auto fixed md:relative pt-6 md:pt-16 bg-background z-[1000] border-b-[1.2px] dark:border-gray-800 md:border-0 rounded-b-lg md:rounded-b-none',
          ],
          {
            hidden: !opened,
            block: opened,
            'md:block': true,
          }
        )}
      >
        <div className="-ml-1 pr-4">
          <div className="pl-6 pr-1">
            <WorkspaceSelect />
          </div>
        </div>
        <div className="mt-5 py-5 pl-9 pr-6">
          <div className="bg-red-40 flex flex-col gap-3">
            {navItems.map((item, index) => (
              <>
                <Link
                  onClick={() => {
                    if (opened) setOpened(false)
                  }}
                  href={`/workspace/${params.workspace}/${item.href}`}
                  className={clsx(
                    [
                      'flex gap-4 items-center dark:hover:text-primary dark:text-gray-300 ease duration-150',
                    ],
                    {
                      // 'text-primary dark:text-primary': pathname === item.href,
                      'text-primary dark:text-primary':
                        pathname?.split('/')?.[3] === item.href ||
                        (pathname?.split('/')?.[3] === item.href?.split('/')[0] && index === 3) ||
                        (pathname?.split('/')?.[3] === item.href?.split('/')[0] && index === 2) ||
                        (pathname?.split('/')?.[3] === item.href?.split('/')[0] && index === 4) ||
                        (pathname?.split('/')?.[3] === 'teams' && index === 2) ||
                        (pathname?.split('/')?.[3] === 'user' && index === 2) ||
                        (pathname?.split('/')?.[3] === 'create-project' && index === 0),
                    }
                  )}
                >
                  {/* {pathname === item.href} */}
                  <item.icon className=" h-5 w-5 opacity-70" />
                  <div className="text-[1.14rem]">{item.label}</div>
                </Link>

                {/* {pathname.split('/')?.[3] == 'teams' && index === 2 && ( */}
                {/*   <div className=" ml-5 flex gap-4 items-center dark:hover:text-primary dark:text-gray-300 ease duration-150"> */}
                {/*     <Icons.users2 className="h-4 w-4 opacity-70" /> */}
                {/*     <div className="text-[1.1rem]">Teams</div> */}
                {/*   </div> */}
                {/* )} */}
              </>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="bg-red-40 flex flex-col gap-3">
            {helpNavItems.map((item) => (
              <a
                href={item.href}
                className="flex gap-4 items-center dark:hover:text-primary dark:text-gray-300 ease duration-150"
              >
                <item.icon className=" h-5 w-5 opacity-70" />
                <div className="text-[1.14rem]">{item.label}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Sidebar
