'use client'

import clsx from 'clsx'
import { WorkspaceUserRole } from '@/types/users'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProjectAccessUser, ProjectRole } from '@/types/projectAccess'
import UserRoleBadge from '@/components/users/UserRoleBadge'

// TODO: role column
export const accessUsersColumns: ColumnDef<ProjectAccessUser>[] = [
  // TODO: toggle all excpet auto roles with meta event or remove it???
  // {
  //   id: 'select',
  //   accessorKey: 'isAutoRole',
  //   header: ({ table }) => (
  //     <div className="flex items-center">
  //       <>
  //         <Checkbox
  //           checked={table.getIsAllPageRowsSelected()}
  //           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //           aria-label="Select all"
  //           className={clsx([''], {
  //             // 'mt-3': table.getIsAllPageRowsSelected(),
  //             'dark:border-gray-600 border-gray-400': !table.getIsAllPageRowsSelected(),
  //           })}
  //         />
  //       </>
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center">
  //       <Checkbox
  //         disabled={row?.original?.isAutoRole === true}
  //         checked={row.getIsSelected()}
  //         className={clsx([], {
  //           // 'mt-3': row.getIsSelected(),
  //           'dark:border-gray-600 border-gray-400': !row.getIsSelected(),
  //         })}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
      const role = row.getValue('role') as ProjectRole

      return (
        <div>
          <UserRoleBadge role={role as any as WorkspaceUserRole} />
        </div>
      )
    },
  },

  {
    accessorKey: 'isAutoRole',
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as any
      // is workspace admin/owner
      const isAutoRole = row.original.isAutoRole

      return (
        <div className="w-full flex justify-end items-center pr-2 gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="sm"
                  variant={'ghost'}
                  onClick={() => {
                    meta.goto(row.original.id)
                  }}
                  className="opacity-70 hover:opacity-100"
                >
                  <Icons.arrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>User profile</TooltipContent>
            </Tooltip>

            {/* // change role */}
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="sm"
                  variant={'ghost'}
                  disabled={false}
                  onClick={() => {
                    if (isAutoRole) return

                    meta.changeRole({
                      id: row.original.id,
                      name: row.original.name,
                      role: row.original.role,
                    })
                  }}
                  className={clsx([''], {
                    'opacity-30 hover:bg-transparent cursor-default': isAutoRole,
                    'opacity-70 hover:opacity-100': !isAutoRole,
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
                  size="sm"
                  variant={'ghost'}
                  disabled={false}
                  onClick={() => {
                    if (isAutoRole) return
                    meta.delete([{ name: row.original.name, id: row.original.id }])
                  }}
                  className={clsx([''], {
                    'opacity-30 hover:bg-transparent cursor-default': isAutoRole,
                    'opacity-70 hover:opacity-100 hover:text-red-600 dark:hover:text-red-500':
                      !isAutoRole,
                  })}
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!isAutoRole ? 'Remove access' : 'Cannot be removed (is workspace admin/owner)'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
]
