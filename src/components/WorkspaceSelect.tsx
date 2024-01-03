'use client'

import Link from 'next/link'
import { Icons } from './icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { SubscriptionPlan } from '@/types/subscription'
import clsx from 'clsx'
import { Badge } from './ui/badge'

interface Props {
  currentWorkspace: {
    id: string
    name: string
    plan: SubscriptionPlan
  }
  allWorkspaces: Array<{
    id: string
    name: string
  }>
  onCreate: () => void
}

const WorkspaceSelect: React.FC<Props> = ({ currentWorkspace, allWorkspaces, onCreate }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-fit w-full px-3 lg:px-4 py-2 rounded-md border-[1.2px] dark:border-gray-800 dark:text-gray-300 hover:dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <div className=" flex flex-col justify-start items-start w-full">
              {/* // TODO: fix truncate */}
              <div className="text-[0.95rem] ml-0 line-clamp-1 w-fit">{currentWorkspace.name}</div>
              <div className={clsx(['text-sm text-muted-foreground'], {})}>
                {currentWorkspace.plan === SubscriptionPlan.Free && (
                  <div className="flex items-center gap-3">
                    <div>Free</div>
                    <div className="bg-yellow-500 text-white dark:bg-yellow-800 dark:text-yellow-200 text-[0.75rem] rounded-md px-1.5 h-5">
                      Upgrade
                    </div>
                  </div>
                )}

                {currentWorkspace.plan === SubscriptionPlan.Startup && 'Startup'}
                {currentWorkspace.plan === SubscriptionPlan.Business && 'Business'}
              </div>
            </div>
            <div>
              <Icons.chevronDown className="h-5 w-5 opacity-60" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-md md:w-[218px] z-[5000] w-[90vw]">
          <DropdownMenuItem
            className="cursor-pointer w-full flex items-center gap-2 font-medium"
            onClick={onCreate}
          >
            <Icons.plus className="h-4 w-4" />
            <div>Create new</div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <div className="flex flex-col gap-1 max-h-40 overflow-y-scroll">
            {allWorkspaces.map(({ id, name }) => (
              <DropdownMenuItem className="w-full cursor-pointer h-full p-0">
                {id === currentWorkspace?.id ? (
                  <div className="flex gap-2 justify-between items-center truncate h-full py-1 px-2 md:px-3.5">
                    <div className="text-primary w-[85%] ">
                      <div className="truncate">{name}</div>
                    </div>
                    <Icons.check className="h-4 w-4 text-primary" />
                  </div>
                ) : (
                  <Link
                    href={`/workspace/${id}/projects`}
                    className="w-full cursor-pointer h-full bg-blue-400x py-1 px-2 md:px-3.5"
                  >
                    <div className="truncate">{name}</div>
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default WorkspaceSelect
