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

interface Props {
  currentWorkspace: {
    id: string
    name: string
  }
  allWorkspaces: Array<{
    id: string
    name: string
    selected?: boolean
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
              <div className="text-sm text-muted-foreground">Enterprise</div>
            </div>
            <div>
              <Icons.chevronDown className="h-5 w-5 opacity-60" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-md w-[218px]">
          <DropdownMenuItem
            className="cursor-pointer w-full flex items-center gap-2 font-medium"
            onClick={onCreate}
          >
            <Icons.plus className="h-4 w-4" />
            <div>Create new</div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          {allWorkspaces.map(({ id, name, selected }) => (
            <DropdownMenuItem className="w-full cursor-pointer">
              {selected ? (
                <div className="flex gap-2 justify-between items-center truncate">
                  <div className="text-primary w-[85%] ">
                    <div className="truncate">{name}</div>
                  </div>
                  <Icons.check className="h-4 w-4 text-primary" />
                </div>
              ) : (
                <Link href={`/workspace/${id}/projects`} className="w-full cursor-pointer">
                  <div className="truncate">{name}</div>
                </Link>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default WorkspaceSelect
