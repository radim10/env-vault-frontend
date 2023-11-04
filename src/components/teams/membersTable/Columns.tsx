'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, WorkspaceUserRole } from '@/types/users'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Checkbox } from '@/components/ui/checkbox'
import clsx from 'clsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

dayjs.extend(relativeTime)

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className={clsx([''], {
            // 'mt-3': table.getIsAllPageRowsSelected(),
            'dark:border-gray-600 border-gray-400': !table.getIsAllPageRowsSelected(),
          })}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          className={clsx([], {
            // 'mt-3': row.getIsSelected(),
            'dark:border-gray-600 border-gray-400': !row.getIsSelected(),
          })}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // {
  //   accessorKey: 'avatarUrl',
  //   header: (_) => <></>,
  //   cell: ({ row }) => {
  //     return (
  //       <Avatar className="w-10 h-10">
  //         <AvatarImage src={row.getValue('avatarUrl')} />
  //         <AvatarFallback>CN</AvatarFallback>
  //       </Avatar>
  //     )
  //   },
  // },
  //
  // {
  //   accessorKey: 'name',
  //   header: ({ column }) => {
  //     return (
  //       <button
  //         className="flex items-center gap-1"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Name
  //         {column.getIsSorted() && (
  //           <>
  //             {column.getIsSorted() === 'asc' ? (
  //               <Icons.arrowUp className="ml-2 h-4 w-4" />
  //             ) : (
  //               <Icons.arrowDown className="ml-2 h-4 w-4" />
  //             )}
  //           </>
  //         )}
  //       </button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const name = row.getValue('name') as string
  //
  //     return <div className="text-left font-bold">{name}</div>
  //   },
  // },
  //
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 ml-14"
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
        <div className="flex items-center gap-5">
          <Avatar className="w-10 h-10">
            <AvatarImage src={row.original.avatarUrl ?? ''} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-left font-bold">{name}</div>
        </div>
      )
    },
  },

  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
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
      const email = row.getValue('email') as string
      return <div className="text-left">{email}</div>
    },
  },

  // {
  //   accessorKey: 'joinedAt',
  //   header: ({ column }) => {
  //     return (
  //       <button
  //         className="flex items-center gap-1"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Joined
  //         {column.getIsSorted() && (
  //           <>
  //             {column.getIsSorted() === 'asc' ? (
  //               <Icons.arrowUp className="ml-2 h-4 w-4" />
  //             ) : (
  //               <Icons.arrowDown className="ml-2 h-4 w-4" />
  //             )}
  //           </>
  //         )}
  //       </button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const date = row.getValue('joinedAt') as string
  //     const relativeDate = dayjs(date).fromNow()
  //
  //     return <div>{relativeDate}</div>
  //   },
  // },

  {
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as any

      return (
        <div className="w-full flex justify-end items-center pr-2 gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="sm"
                  variant={'ghost'}
                  onClick={() => {
                    meta.showProfile(row.original.id)
                  }}
                  className="opacity-70 hover:opacity-100"
                >
                  <Icons.arrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>User profile</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="sm"
                  variant={'ghost'}
                  onClick={() => {
                    meta.deleteUser({ name: row.original.name, id: row.original.id })
                  }}
                  className="opacity-70 hover:opacity-100 hover:text-red-600 dark:hover:text-red-500"
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete user</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
]
