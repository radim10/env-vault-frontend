'use client'

import clsx from 'clsx'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import relativeTime from 'dayjs/plugin/relativeTime'
import { WorkspaceInvitation, WorkspaceUserRole } from '@/types/users'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { invitationsStore } from '@/stores/invitations'
import { ListTeam } from '@/types/teams'

dayjs.extend(relativeTime)

export const teamsColumns: ColumnDef<ListTeam>[] = [
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
    id: 'actions',
    cell: ({ row, table }) => {
      return (
        <>
          <Icons.arrowRight className="h-4 w-4" />
        </>
      )
    },
  },
]
