'use client'

import clsx from 'clsx'
import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import UserRoleBadge from '../UserRoleBadge'
import relativeTime from 'dayjs/plugin/relativeTime'
import { WorkspaceInvitation, WorkspaceUserRole } from '@/types/users'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useInvitationsStore } from '@/stores/invitations'
import { useMemo } from 'react'

dayjs.extend(relativeTime)

const useInvitationsTableColumns = () => {
  const invitationsStore = useInvitationsStore()

  const cols = useMemo<Array<ColumnDef<WorkspaceInvitation>>>(
    () => [
      {
        id: 'sender',
        accessorKey: 'createdBy',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-1"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Sent by
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
          const sentByName = row.original.createdBy?.name

          return <div className="text-left">{sentByName}</div>
        },
      },

      {
        accessorKey: 'email',
        header: ({ column }) => {
          // return <span>Email</span>
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
          const email = row.original.email

          return <div className="text-left">{email}</div>
        },
      },

      {
        accessorKey: 'role',
        // sortingFn: (a, b) => {
        //   return a.getValue('role').localeCompare(b.getValue('role'))
        // },
        header: ({ column }) => {
          // return <span>Role</span>
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
        id: 'created',
        accessorKey: 'createdAt',
        // sortingFn: (a, b) => {
        //   return (a < b ? 1 : -1)
        // },
        header: ({ column }) => {
          // return <span>Last sent</span>
          return (
            <button
              className="flex items-center gap-1"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Created
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
          // const date = row.original.lastSentAt ?? row.original?.createdAt
          const date = row.original.createdAt
          const relativeDate = dayjs(date).fromNow()

          return <div>{relativeDate}</div>
        },
      },

      {
        id: 'actions',
        cell: ({ row, table }) => {
          const role = row.getValue('role') as WorkspaceUserRole
          const meta = table.options.meta as any
          const resendingInProgress = invitationsStore.resendingIds.includes(row.original.id)
          const lastSentAt = row.original.lastSentAt ?? row.original?.createdAt

          const canResend = dayjs().diff(dayjs(lastSentAt), 'h') >= 24
          // const canResend = true

          const isResent = invitationsStore.resentIds.includes(row.original.id)
          const resendError = invitationsStore.errorIds.includes(row.original.id)

          return (
            <div className="w-full flex justify-end items-center pr-2 gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {!isResent && !resendError && (
                      <Button
                        disabled={isResent}
                        onClick={() => {
                          if (resendingInProgress || isResent || !canResend) return

                          meta.resend(row.original.id)

                          invitationsStore.setResentIds([
                            ...invitationsStore.resentIds,
                            row.original.id,
                          ])
                        }}
                        size={'sm'}
                        variant="ghost"
                        className={clsx({
                          'opacity-25 hover:bg-transparent': !canResend,
                          'opacity-80 hover:opacity-100 hover:text-primary':
                            !resendingInProgress && canResend,
                          'text-primary opacity-100 hover:bg-transparent cursor-default hover:text-primary':
                            resendingInProgress && canResend,
                        })}
                      >
                        <>
                          {resendingInProgress ? (
                            <Icons.loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Icons.sendHorizontal className="h-4 w-4" />
                          )}
                        </>
                      </Button>
                    )}

                    {isResent && !resendError && (
                      <Button
                        size={'sm'}
                        variant="ghost"
                        className="text-green-600 hover:bg-transparent hover:text-green-600 cursor-default"
                      >
                        <Icons.checkCircle2 className="h-4 w-4" />
                      </Button>
                    )}

                    {resendError && (
                      <Button
                        size={'sm'}
                        variant="ghost"
                        className="text-red-600 hover:bg-transparent hover:text-red-600 cursor-default"
                      >
                        <Icons.xCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </TooltipTrigger>

                  <TooltipContent>
                    {!isResent && !resendError && (
                      <>
                        {canResend ? (
                          <>{resendingInProgress ? 'Resending invitation' : 'Resend invitation'}</>
                        ) : (
                          <>Can be resnend once a 24 hours</>
                        )}
                      </>
                    )}
                    {isResent && !resendError && <>Invitation resent</>}
                    {resendError && <>Something went wrong</>}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger disabled={resendingInProgress}>
                    <Button
                      disabled={resendingInProgress}
                      onClick={() => {
                        meta.delete({
                          id: row.original.id,
                          email: row.original.email,
                          role,
                        })
                      }}
                      size={'sm'}
                      variant="ghost"
                      className={clsx(
                        [
                          'opacity-70 hover:opacity-100 dark:hover:text-red-500 Xdark:text-red-500 xtext-red-600 hover:text-red-600',
                        ],
                        {
                          'cursor-not-allowed': resendingInProgress,
                        }
                      )}
                    >
                      <Icons.trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Delete invitation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        },
      },
    ],
    [invitationsStore]
  )

  return cols
}

export default useInvitationsTableColumns

// export const invitationsColumns: ColumnDef<WorkspaceInvitation>[] = [
//   {
//     id: 'sender',
//     accessorKey: 'createdBy',
//     header: ({ column }) => {
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Sent by
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
//       const sentByName = row.original.createdBy?.name
//
//       return <div className="text-left">{sentByName}</div>
//     },
//   },
//
//   {
//     accessorKey: 'email',
//     header: ({ column }) => {
//       // return <span>Email</span>
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
//       const email = row.original.email
//
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
//       // return <span>Role</span>
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
//     id: 'created',
//     accessorKey: 'createdAt',
//     // sortingFn: (a, b) => {
//     //   return (a < b ? 1 : -1)
//     // },
//     header: ({ column }) => {
//       // return <span>Last sent</span>
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Created
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
//       // const date = row.original.lastSentAt ?? row.original?.createdAt
//       const date = row.original.createdAt
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
//       const resendingInProgress = invitationsStore.getState().resendingIds.includes(row.original.id)
//       const lastSentAt = row.original.lastSentAt ?? row.original?.createdAt
//
//       const canResend = dayjs().diff(dayjs(lastSentAt), 'h') >= 24
//       const isResent = invitationsStore.getState().resentIds.includes(row.original.id)
//       const resendError = invitationsStore.getState().errorIds.includes(row.original.id)
//
//       return (
//         <div className="w-full flex justify-end items-center pr-2 gap-1.5">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger>
//                 {!isResent && !resendError && (
//                   <Button
//                     disabled={isResent}
//                     onClick={() => {
//                       if (resendingInProgress || isResent || !canResend) return
//
//                       meta.resend(row.original.id)
//
//                       invitationsStore.setState((state) => {
//                         return produce(state, (draftState) => {
//                           draftState.resendingIds.push(row.original.id)
//                         })
//                       })
//                     }}
//                     size={'sm'}
//                     variant="ghost"
//                     className={clsx({
//                       'opacity-25 hover:bg-transparent': !canResend,
//                       'opacity-80 hover:opacity-100 hover:text-primary':
//                         !resendingInProgress && canResend,
//                       'text-primary opacity-100 hover:bg-transparent cursor-default hover:text-primary':
//                         resendingInProgress && canResend,
//                     })}
//                   >
//                     <>
//                       {resendingInProgress ? (
//                         <Icons.loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Icons.sendHorizontal className="h-4 w-4" />
//                       )}
//                     </>
//                   </Button>
//                 )}
//
//                 {isResent && !resendError && (
//                   <Button
//                     size={'sm'}
//                     variant="ghost"
//                     className="text-green-600 hover:bg-transparent hover:text-green-600 cursor-default"
//                   >
//                     <Icons.checkCircle2 className="h-4 w-4" />
//                   </Button>
//                 )}
//
//                 {resendError && (
//                   <Button
//                     size={'sm'}
//                     variant="ghost"
//                     className="text-red-600 hover:bg-transparent hover:text-red-600 cursor-default"
//                   >
//                     <Icons.xCircle className="h-4 w-4" />
//                   </Button>
//                 )}
//               </TooltipTrigger>
//
//               <TooltipContent>
//                 {!isResent && !resendError && (
//                   <>
//                     {canResend ? (
//                       <>{resendingInProgress ? 'Resending invitation' : 'Resend invitation'}</>
//                     ) : (
//                       <>Can be resnend once a 24 hours</>
//                     )}
//                   </>
//                 )}
//                 {isResent && !resendError && <>Invitation resent</>}
//                 {resendError && <>Something went wrong</>}
//               </TooltipContent>
//             </Tooltip>
//
//             <Tooltip>
//               <TooltipTrigger disabled={resendingInProgress}>
//                 <Button
//                   disabled={resendingInProgress}
//                   onClick={() => {
//                     meta.delete({
//                       id: row.original.id,
//                       email: row.original.email,
//                       role,
//                     })
//                   }}
//                   size={'sm'}
//                   variant="ghost"
//                   className={clsx(
//                     [
//                       'opacity-70 hover:opacity-100 dark:hover:text-red-500 Xdark:text-red-500 xtext-red-600 hover:text-red-600',
//                     ],
//                     {
//                       'cursor-not-allowed': resendingInProgress,
//                     }
//                   )}
//                 >
//                   <Icons.trash className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//
//               <TooltipContent>Delete invitation</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       )
//     },
//   },
// ]
