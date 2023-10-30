'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, WorkspaceInvitation, WorkspaceUser, WorkspaceUserRole } from '@/types/users'
import { ColumnDef } from '@tanstack/react-table'
import { produce } from 'immer'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { invitationsStore } from '@/stores/invitations'
import clsx from 'clsx'

dayjs.extend(relativeTime)

export const invitationsColumns: ColumnDef<WorkspaceInvitation>[] = [
  // {
  //   accessorKey: 'createdBy',
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
  {
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
      return <span>Email</span>
      // return (
      //   <button
      //     className="flex items-center gap-1"
      //     onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      //   >
      //     Email
      //     {column.getIsSorted() && (
      //       <>
      //         {column.getIsSorted() === 'asc' ? (
      //           <Icons.arrowUp className="ml-2 h-4 w-4" />
      //         ) : (
      //           <Icons.arrowDown className="ml-2 h-4 w-4" />
      //         )}
      //       </>
      //     )}
      //   </button>
      // )
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
      return <span>Role</span>
      // return (
      //   <button
      //     className="flex items-center gap-1"
      //     onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      //   >
      //     Role
      //     {column.getIsSorted() && (
      //       <>
      //         {column.getIsSorted() === 'asc' ? (
      //           <Icons.arrowUp className="ml-2 h-4 w-4" />
      //         ) : (
      //           <Icons.arrowDown className="ml-2 h-4 w-4" />
      //         )}
      //       </>
      //     )}
      //   </button>
      // )
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
    accessorKey: 'lastSentAt',
    header: ({ column }) => {
      return <span>Last sent</span>
      //   return (
      //     <button
      //       className="flex items-center gap-1"
      //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      //     >
      //       Last sent
      //       {column.getIsSorted() && (
      //         <>
      //           {column.getIsSorted() === 'asc' ? (
      //             <Icons.arrowUp className="ml-2 h-4 w-4" />
      //           ) : (
      //             <Icons.arrowDown className="ml-2 h-4 w-4" />
      //           )}
      //         </>
      //       )}
      //     </button>
      //   )
    },
    cell: ({ row }) => {
      const date = row.original.lastSentAt ?? row.original?.createdAt
      const relativeDate = dayjs(date).fromNow()

      return <div>{relativeDate}</div>
    },
  },

  {
    id: 'actions',
    cell: ({ row, table }) => {
      const role = row.getValue('role') as WorkspaceUserRole
      const meta = table.options.meta as any
      const resendingInProgress = invitationsStore.getState().resendingIds.includes(row.original.id)
      const lastSentAt = row.original.lastSentAt ?? row.original?.createdAt

      const canResend = dayjs().diff(dayjs(lastSentAt), 'h') >= 24
      const isResent = invitationsStore.getState().resentIds.includes(row.original.id)
      const resendError = invitationsStore.getState().errorIds.includes(row.original.id)

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

                      invitationsStore.setState((state) => {
                        return produce(state, (draftState) => {
                          draftState.resendingIds.push(row.original.id)
                        })
                      })
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
]
