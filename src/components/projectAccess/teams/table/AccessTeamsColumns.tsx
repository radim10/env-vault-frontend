'use client'

import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ListTeam } from '@/types/teams'
import clsx from 'clsx'

dayjs.extend(relativeTime)

export const accessTeamsColumns: ColumnDef<ListTeam>[] = [
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
    header: 'Actions',
    cell: ({ row, table }) => {
      const meta = table.options.meta as any

      return (
        <div className="w-full flex justify-start items-center gap-1.5 bg-red-400X">
          <Button
            size="sm"
            variant={'ghost'}
            onClick={() => meta.goto(row.original.id)}
            className="opacity-70 hover:opacity-100"
          >
            <Icons.arrowRight className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => {}}
            size={'sm'}
            variant="ghost"
            className={clsx([
              'opacity-70 hover:opacity-100 dark:hover:text-red-500 Xdark:text-red-500 xtext-red-600 hover:text-red-600',
            ])}
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
