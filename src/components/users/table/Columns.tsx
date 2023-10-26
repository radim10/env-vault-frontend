'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/types/users'
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    // header: () => <div className="text-left">User</div>,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          User
          {column.getIsSorted() === 'asc' ? <Icons.arrowUp className="ml-2 h-4 w-4" /> : <Icons.arrowDown className="ml-2 h-4 w-4" />}
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string

      return (
        <div className="flex flex-row gap-2 md:gap-3">
          <div>
            <Avatar className="w-10 h-10">
              <AvatarImage src={row.getValue('avatarUrl')} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col">
            <div className="text-left font-bold">{name}</div>

            <div className="text-left text-muted-foreground">email@example.com</div>
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'role',
    header: () => <div className="text-left">Role</div>,
    cell: ({ row }) => {
      const name = row.getValue('name') as string

      return <div>Admin</div>
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original

      return (
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
      )
    },
  },
]
