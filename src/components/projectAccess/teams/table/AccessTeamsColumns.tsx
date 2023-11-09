'use client'

import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import relativeTime from 'dayjs/plugin/relativeTime'
import clsx from 'clsx'
import { ProjectAccessTeam, ProjectRole } from '@/types/projectAccess'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

dayjs.extend(relativeTime)

export const accessTeamsColumns: ColumnDef<ProjectAccessTeam>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          {column.getIsSorted() && (
            <>
              {column.getIsSorted() === 'asc' ? (
                <Icons.arrowUp className="ml-2 h-4 w-4" />
              ) : (
                <Icons.arrowDown className="ml-2 h-4 w-4" />
              )}
            </>
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return (
        <div className="text-left font-bold flex items-center gap-2 md:pl-2">
          {/* <div className="h-2.5 w-2.5 bg-green-500 dark:bg-green-600 rounded-full"></div> */}
          {name}
        </div>
      )
    },
  },

  {
    accessorKey: 'membersCount',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Members
          {column.getIsSorted() && (
            <>
              {column.getIsSorted() === 'asc' ? (
                <Icons.arrowUp className="ml-2 h-4 w-4" />
              ) : (
                <Icons.arrowDown className="ml-2 h-4 w-4" />
              )}
            </>
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const membersCount = row.original.membersCount
      return <div className="text-left">{membersCount === 0 ? '0' : membersCount}</div>
    },
  },

  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          P. role
          {column.getIsSorted() && (
            <>
              {column.getIsSorted() === 'asc' ? (
                <Icons.arrowUp className="ml-2 h-4 w-4" />
              ) : (
                <Icons.arrowDown className="ml-2 h-4 w-4" />
              )}
            </>
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <div className="text-left">
          <UserRoleBadge role={role as any as WorkspaceUserRole} />
        </div>
      )
    },
  },

  {
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        goto: (id: string) => void
        delete: (args: { id: string; name: string }) => void
        changeRole: (args: {
          id: string
          name: string
          role: ProjectRole
          membersCount: number
        }) => void
      }

      return (
        <div className="w-full flex justify-start items-center gap-1.5 bg-red-400X">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="sm"
                  variant={'ghost'}
                  onClick={() => meta.goto(row.original.id)}
                  className="opacity-70 hover:opacity-100"
                >
                  <Icons.arrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to team</TooltipContent>
            </Tooltip>

            {/* // change role */}
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="sm"
                  variant={'ghost'}
                  disabled={false}
                  onClick={() => {
                    meta.changeRole({
                      id: row.original.id,
                      name: row.original.name,
                      membersCount: row.original.membersCount,
                      role: row.original.role,
                    })
                  }}
                  className={clsx([''], {
                    'opacity-70 hover:opacity-100': true,
                  })}
                >
                  <Icons.userCog className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Change role</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => meta.delete({ id: row.original.id, name: row.original.name })}
                  size={'sm'}
                  variant="ghost"
                  className={clsx([
                    'opacity-70 hover:opacity-100 dark:hover:text-red-500 Xdark:text-red-500 xtext-red-600 hover:text-red-600',
                  ])}
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
                <TooltipContent>Remove access</TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
]
