'use client'

import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ListTeam } from '@/types/teams'

dayjs.extend(relativeTime)

export const userTeamsColumns: ColumnDef<ListTeam>[] = [
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
      return <div className="text-left font-bold flex items-center gap-2">{name}</div>
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
    header: 'Actions',
    cell: ({ row, table }) => {
      const meta = table.options.meta as any

      return (
        <Button
          size="sm"
          variant={'ghost'}
          onClick={() => meta.goto(row.original.id)}
          className="opacity-70 hover:opacity-100"
        >
          <Icons.arrowRight className="h-4 w-4" />
        </Button>
      )
    },
  },
]
