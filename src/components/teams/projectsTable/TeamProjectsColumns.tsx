'use client'

import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import relativeTime from 'dayjs/plugin/relativeTime'
import { TeamProjectAccess } from '@/types/teams'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

dayjs.extend(relativeTime)

export const teamProjectsColumns: ColumnDef<TeamProjectAccess>[] = [
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
        <div className="text-left font-bold flex items-center gap-2">
          {/* <div className="h-2.5 w-2.5 bg-green-500 dark:bg-green-600 rounded-full"></div> */}
          {name}
        </div>
      )
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
    header: 'Actions',
    cell: ({ row, table }) => {
      const projectName = row?.original?.name
      const meta = table.options.meta as {
        gotoProject: (projectName: string) => void
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                variant={'ghost'}
                onClick={() => meta.gotoProject(projectName)}
                className="opacity-70 hover:opacity-100"
              >
                <Icons.arrowRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Go to project</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
]
