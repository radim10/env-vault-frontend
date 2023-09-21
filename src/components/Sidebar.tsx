import React from 'react'
import Link from 'next/link'
import { Icons } from './icons'
import { Separator } from './ui/separator'

const navItems = [
  { label: 'Projects', href: '/projects', icon: Icons.folder },
  { label: 'Team', href: '/team', icon: Icons.users },
  { label: 'Activity', href: '/activity', icon: Icons.users },
  { label: 'Tokens', href: '/tokens', icon: Icons.keyRound },
  { label: 'Settings', href: '/settings', icon: Icons.settings },
]

const helpNavItems = [
  { label: 'Docs', href: '/docs', icon: Icons.book },
  { label: 'SDKs', href: '/docs', icon: Icons.code },
  { label: 'Community', href: '/Community', icon: Icons.mic2 },
]

const Sidebar = () => {
  return (
    <div className="h-full border-r-[1.2px] 0 dark:border-gray-800">
      <div className="pt-10 px-9">LOGO</div>
      <div className="py-5 pl-9 pr-6 pt-36">
        <div className="bg-red-40 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              href={item.href}
              className="flex gap-4 items-center dark:hover:text-primary dark:text-gray-300 ease duration-150"
            >
              <item.icon className=" h-5 w-5 opacity-70" />
              <div className="text-[1.15rem]">{item.label}</div>
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
              <div className="text-[1.15rem]">{item.label}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Sidebar
