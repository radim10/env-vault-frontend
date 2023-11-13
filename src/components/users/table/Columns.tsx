'use client'

import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WorkspaceUser, WorkspaceUserRole } from '@/types/users'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import UserRoleBadge from '../UserRoleBadge'
import useCurrentUserStore from '@/stores/user'

dayjs.extend(relativeTime)

const useUsersTableColumns = () => {
  const { isMemberRole } = useCurrentUserStore()

  const cols = useMemo<ColumnDef<WorkspaceUser>[]>(
    () => [
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
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-1"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Joined
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
          const date = row.getValue('joinedAt') as string
          const relativeDate = dayjs(date).fromNow()

          return <div>{relativeDate}</div>
        },
      },

      {
        id: 'actions',
        cell: ({ row, table }) => {
          const role = row.getValue('role') as WorkspaceUserRole
          const meta = table.options.meta as any

          return (
            <div className="w-full flex justify-end items-center pr-2">
              {isMemberRole() && (
                <>
                  <Button
                    size={'sm'}
                    variant="ghost"
                    onClick={() => {
                      meta.showProfile(row.original?.id)
                    }}
                    className=""
                  >
                    <Icons.arrowRight className="h-4 w-4 " />
                  </Button>
                </>
              )}
              {!isMemberRole() && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] ">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem
                        onClick={() => {
                          meta.showProfile(row.original?.id)
                        }}
                        className="flex px-2.5 py-2 gap-3 items-center"
                      >
                        <Icons.arrowRight className="h-4 w-4 " />
                        <span className="">Go to profile</span>
                      </DropdownMenuItem>

                      {/* <DropdownMenuSeparator /> */}

                      {role !== WorkspaceUserRole.OWNER && (
                        <DropdownMenuItem
                          onClick={() => {
                            meta.updateRole({
                              name: row.original.name,
                              id: row.original.id,
                              role: row.original.role,
                            })
                          }}
                          className="flex px-2.5 py-2 gap-3 items-center"
                        >
                          <Icons.penSquare className="h-4 w-4 " />
                          <span className="">Chage role</span>
                        </DropdownMenuItem>
                      )}

                      {role !== WorkspaceUserRole.OWNER && (
                        <DropdownMenuItem
                          onClick={() => {
                            meta.deleteUser({ name: row.original.name, id: row.original.id })
                          }}
                          className="px-2.5 py-2 flex gap-3 items-center dark:hover:text-red-500 dark:text-red-500 text-red-600 hover:text-red-600"
                        >
                          <Icons.trash className="h-4 w-4 " />
                          <span className="">Delete</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  return cols
}

export default useUsersTableColumns

// export const columns: ColumnDef<WorkspaceUser>[] = [
//   {
//     accessorKey: 'avatarUrl',
//     header: (_) => <></>,
//     cell: ({ row }) => {
//       return (
//         <Avatar className="w-10 h-10">
//           <AvatarImage src={row.getValue('avatarUrl')} />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//       )
//     },
//   },
//
//   {
//     accessorKey: 'name',
//     header: ({ column }) => {
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Name
//           {column.getIsSorted() && (
//             <>
//               {column.getIsSorted() === 'asc' ? (
//                 <Icons.arrowUp className="ml-2 h-4 w-4" />
//               ) : (
//                 <Icons.arrowDown className="ml-2 h-4 w-4" />
//               )}
//             </>
//           )}
//         </button>
//       )
//     },
//     cell: ({ row }) => {
//       const name = row.getValue('name') as string
//
//       return <div className="text-left font-bold">{name}</div>
//     },
//   },
//
//   {
//     accessorKey: 'email',
//     header: ({ column }) => {
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Email
//           {column.getIsSorted() && (
//             <>
//               {column.getIsSorted() === 'asc' ? (
//                 <Icons.arrowUp className="ml-2 h-4 w-4" />
//               ) : (
//                 <Icons.arrowDown className="ml-2 h-4 w-4" />
//               )}
//             </>
//           )}
//         </button>
//       )
//     },
//     cell: ({ row }) => {
//       const email = row.getValue('email') as string
//       return <div className="text-left">{email}</div>
//     },
//   },
//
//   {
//     accessorKey: 'role',
//     // sortingFn: (a, b) => {
//     //   return a.getValue('role').localeCompare(b.getValue('role'))
//     // },
//     header: ({ column }) => {
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Role
//           {column.getIsSorted() && (
//             <>
//               {column.getIsSorted() === 'asc' ? (
//                 <Icons.arrowUp className="ml-2 h-4 w-4" />
//               ) : (
//                 <Icons.arrowDown className="ml-2 h-4 w-4" />
//               )}
//             </>
//           )}
//         </button>
//       )
//     },
//     cell: ({ row }) => {
//       const role = row.getValue('role') as WorkspaceUserRole
//
//       return (
//         <div>
//           <UserRoleBadge role={role} />
//         </div>
//       )
//     },
//   },
//
//   {
//     accessorKey: 'joinedAt',
//     header: ({ column }) => {
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Joined
//           {column.getIsSorted() && (
//             <>
//               {column.getIsSorted() === 'asc' ? (
//                 <Icons.arrowUp className="ml-2 h-4 w-4" />
//               ) : (
//                 <Icons.arrowDown className="ml-2 h-4 w-4" />
//               )}
//             </>
//           )}
//         </button>
//       )
//     },
//     cell: ({ row }) => {
//       const date = row.getValue('joinedAt') as string
//       const relativeDate = dayjs(date).fromNow()
//
//       return <div>{relativeDate}</div>
//     },
//   },
//
//   {
//     id: 'actions',
//     cell: ({ row, table }) => {
//       const role = row.getValue('role') as WorkspaceUserRole
//       const meta = table.options.meta as any
//
//       return (
//         <div className="w-full flex justify-end items-center pr-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-[160px] ">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//
//               <DropdownMenuItem
//                 onClick={() => {
//                   meta.showProfile(row.original?.id)
//                 }}
//                 className="flex px-2.5 py-2 gap-3 items-center"
//               >
//                 <Icons.arrowRight className="h-4 w-4 " />
//                 <span className="">Go to profile</span>
//               </DropdownMenuItem>
//
//               {/* <DropdownMenuSeparator /> */}
//
//               {role !== WorkspaceUserRole.OWNER && (
//                 <DropdownMenuItem
//                   onClick={() => {
//                     meta.updateRole({
//                       name: row.original.name,
//                       id: row.original.id,
//                       role: row.original.role,
//                     })
//                   }}
//                   className="flex px-2.5 py-2 gap-3 items-center"
//                 >
//                   <Icons.penSquare className="h-4 w-4 " />
//                   <span className="">Chage role</span>
//                 </DropdownMenuItem>
//               )}
//
//               {role !== WorkspaceUserRole.OWNER && (
//                 <DropdownMenuItem
//                   onClick={() => {
//                     meta.deleteUser({ name: row.original.name, id: row.original.id })
//                   }}
//                   className="px-2.5 py-2 flex gap-3 items-center dark:hover:text-red-500 dark:text-red-500 text-red-600 hover:text-red-600"
//                 >
//                   <Icons.trash className="h-4 w-4 " />
//                   <span className="">Delete</span>
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]
