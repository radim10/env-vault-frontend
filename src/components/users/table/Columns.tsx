'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, WorkspaceUser, WorkspaceUserRole } from '@/types/users'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import UserRoleBadge from '../UserRoleBadge'

dayjs.extend(relativeTime)

export const columns: ColumnDef<WorkspaceUser>[] = [
  {
    accessorKey: 'avatarUrl',
    header: (_) => <></>,
    cell: ({ row }) => {
      return (
        <Avatar className="w-10 h-10">
          <AvatarImage src={row.getValue('avatarUrl')} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )
    },
  },

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

      return <div className="text-left font-bold">{name}</div>
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
      // const email = row.getValue('name') as string
      const email = 'email@example.com'
      return <div className="text-left">{email}</div>
    },
  },

  {
    accessorKey: 'role',
    // sortingFn: (a, b) => {
    //   return a.getValue('role').localeCompare(b.getValue('role'))
    // },
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Role
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
      const role = row.getValue('role') as WorkspaceUserRole

      return (
        <div>
          <UserRoleBadge role={role} />
        </div>
      )
    },
  },

  {
    accessorKey: 'joinedAt',
    header: () => <div className="text-left">Joined</div>,
    cell: ({ row }) => {
      const date = row.getValue('joinedAt') as string
      const relativeDate = dayjs(date).fromNow()

      return <div>{relativeDate}</div>
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original

      return (
        <div className="w-full flex justify-end items-center pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
