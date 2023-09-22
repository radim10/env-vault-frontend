'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { Icons } from './icons'
import { Separator } from './ui/separator'
import WorkspaceSelect from './WorkspaceSelect'
import clsx from 'clsx'

const navItems = [
  { label: 'Projects', href: 'projects', icon: Icons.folder },
  { label: 'Team', href: 'team', icon: Icons.users },
  { label: 'Activity', href: 'activity', icon: Icons.users },
  { label: 'Tokens', href: 'tokens', icon: Icons.keyRound },
  { label: 'Settings', href: 'settings', icon: Icons.settings },
]

const helpNavItems = [
  { label: 'Docs', href: 'docs', icon: Icons.book },
  { label: 'SDKs', href: 'docs', icon: Icons.code },
  { label: 'Community', href: 'Community', icon: Icons.mic2 },
]

const Sidebar = () => {
  const pathname = usePathname()
  const params = useParams()
  console.log(params)

  return (
    <div className="h-full border-r-[1.2px] dark:border-gray-800">
      <div className="pt-10 px-9">LOGO</div>
      <div className=" pt-16">
        <div className="-ml-1 pr-4">
          <div className="pl-6 pr-1">
            <WorkspaceSelect />
          </div>
        </div>
        <div className="mt-5 py-5 pl-9 pr-6">
          <div className="bg-red-40 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                href={`/workspace/${params.workspace}/${item.href}`}
                className={clsx(
                  [
                    'flex gap-4 items-center dark:hover:text-primary dark:text-gray-300 ease duration-150',
                  ],
                  {
                    // 'text-primary dark:text-primary': pathname === item.href,
                    'text-primary dark:text-primary': pathname?.split('/')?.[3] === item.href,
                  }
                )}
              >
                {/* {pathname === item.href} */}
                {/* {pathname.split("/")?.[3]} */}
                <item.icon className=" h-5 w-5 opacity-70" />
                <div className="text-[1.14rem]">{item.label}</div>
              </Link>
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
