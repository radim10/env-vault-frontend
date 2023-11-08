'use client'

import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import relativeTime from 'dayjs/plugin/relativeTime'
import { UserAccessProject } from '@/types/userAccess'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'

dayjs.extend(relativeTime)

export const userAccessProjectColumns: ColumnDef<UserAccessProject>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project
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
      const projectName = row?.original?.name
      return (
        <div className="text-left font-bold flex items-center gap-2 md:pl-2">{projectName}</div>
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
      const projectName = row.original.name

      const meta = table.options.meta as {
        goto: (projectName: string) => void
      }

      return (
        <div className="flex items-center w-full">
          <Button
            size="sm"
            variant={'ghost'}
            onClick={() => meta.goto(projectName)}
            className="ml-1 opacity-70 hover:opacity-100"
          >
            <Icons.arrowRight className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
