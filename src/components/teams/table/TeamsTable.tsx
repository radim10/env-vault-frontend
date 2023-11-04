'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { produce } from 'immer'
import clsx from 'clsx'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useListWorkspaceInvitations } from '@/api/queries/users'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpdateEffect } from 'react-use'
import { QueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { invitationsStore } from '@/stores/invitations'
import { useResendWorkspaceInvitation } from '@/api/mutations/users'
import { ListWorkspaceInvitationsData } from '@/api/requests/users'
import useUserTablesPaginationStore from '@/stores/userTables'
import { useGetTeams } from '@/api/queries/teams'
import { ListTeam } from '@/types/teams'
import TeamsToolbar from './Toolbar'
import { useRouter } from 'next/navigation'

interface DataTableProps {
  workspaceId: string
  columns: ColumnDef<ListTeam>[]
  queryClient: QueryClient
  onCreateTeam: () => void
}

// skipper util
function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}

function TeamsTable({ columns, workspaceId, queryClient, onCreateTeam }: DataTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const defaultData = useMemo(() => [], [])
  const { invitationsPageSize, setInvitationsPageSize } = useUserTablesPaginationStore()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: invitationsPageSize ?? 5,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'members',
      desc: true,
    },
  ])

  const fetchDataOptions = {
    workspaceId,
    // page: pageIndex,
    // sort: (sorting?.[0]?.id) as any,
    // desc: sorting?.[0]?.desc ?? undefined,
  }

  const getCurrentKey = () => ['workspace-invitations', workspaceId]

  const { mutate: resendInvitation } = useResendWorkspaceInvitation({
    onSuccess: () => {
      toast({
        title: 'Invitation has been resent',
        variant: 'success',
      })
    },
    onError: () => {
      toast({
        title: 'Failed to resend invitation',
        variant: 'destructive',
      })
    },
  })

  const { data, isLoading } = useGetTeams(fetchDataOptions)

  useUpdateEffect(() => {
    if (pageSize !== invitationsPageSize) {
      setInvitationsPageSize(pageSize)
    }
  }, [pageSize])

  useUpdateEffect(() => {
    const newInvitation = invitationsStore.getState().newInvitation

    if (newInvitation) {
      const data = queryClient.getQueryData<ListWorkspaceInvitationsData>(getCurrentKey())

      if (data) {
        const updatedInvitations = produce(data, (draftData) => {
          draftData.data.unshift(newInvitation)
          draftData.totalCount = draftData.totalCount + 1
        })

        queryClient.setQueryData(getCurrentKey(), updatedInvitations)
      }

      table.resetSorting()

      // reset state
      invitationsStore.setState((state) => {
        return produce(state, (draftState) => {
          draftState.newInvitation = undefined
        })
      })
    }
  }, [invitationsStore.getState().newInvitation])

  const handleResendInvitation = (id: string) => {
    invitationsStore.setState((state) => {
      return produce(state, (draftState) => {
        draftState.resentIds.push(id)
      })
    })

    resendInvitation(
      { workspaceId, invitationId: id },
      {
        onSuccess: () => {
          invitationsStore.setState((state) => {
            return produce(state, (draftState) => {
              draftState.resendingIds = draftState.resendingIds.filter((item) => item !== id)
              draftState.resentIds.push(id)
            })
          })

          updateSentAtState(id)
        },
        onError: () => {
          invitationsStore.setState((state) => {
            return produce(state, (draftState) => {
              draftState.resendingIds = draftState.resendingIds.filter((item) => item !== id)
              draftState.errorIds.push(id)
            })
          })
        },
      }
    )
  }

  const updateSentAtState = (invitationId: string) => {
    // const currentKey = getCurrentKey()
    // const data = queryClient.getQueryData<WorkspaceInvitation[]>(currentKey)
    //
    // if (data) {
    //   const updData = produce(data, (draftData) => {
    //     const itemIndex = data.findIndex((item) => item.id === invitationId)
    //
    //     if (itemIndex !== -1) {
    //       draftData[itemIndex].lastSentAt = new Date()
    //     }
    //   })
    //
    //   queryClient.setQueryData(currentKey, updData)
    // }
  }

  const handleDeletedInvitation = (invitationId: string) => {
    const currentKey = getCurrentKey()
    const data = queryClient.getQueryData<ListWorkspaceInvitationsData>(currentKey)

    if (data) {
      const updatedInvitations = produce(data, (draftData) => {
        const itemIndex = data?.data?.findIndex((item) => item.id === invitationId)

        if (itemIndex !== -1) {
          draftData.data?.splice(itemIndex, 1)
          draftData.totalCount = draftData.totalCount - 1
        }
      })

      const page = pagination?.pageIndex + 1
      const totalPages = Math.ceil((table.getFilteredRowModel().rows.length - 1) / pageSize)

      // if (!(page > totalPages)) skipAutoResetPageIndex()
      skipAutoResetPageIndex()

      if (page > totalPages) {
        setPagination((prev) => {
          return { ...prev, pageIndex: prev?.pageIndex - 1 }
        })
      }

      queryClient.setQueryData(currentKey, updatedInvitations)
      //
    }

    //
    //
    toast({
      title: 'Invitation has been deleted',
      variant: 'success',
    })
  }

  const handleGoToTeam = (teamId: string) => {
    router.push(`/workspace/${workspaceId}/teams/${teamId}/members`)
  }

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.length / pageSize) : undefined,
    data: data ?? defaultData,
    columns,
    meta: {
      resend: handleResendInvitation,
      goto: handleGoToTeam,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (sorting) => {
      setSorting(sorting)
    },
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex,
    enableSorting: !isLoading,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  })

  return (
    <div>
      <TeamsToolbar
        count={data?.length ?? null}
        loading={isLoading}
        isSearchCount={(table.getColumn('name')?.getFilterValue() as string)?.length > 0}
        search={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onSearch={(value) => {
          table.getColumn('name')?.setFilterValue(value)
        }}
        onNewTeam={() => onCreateTeam()}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={clsx([''], {
                        'md:w-[45%]': index === 0 || index === 1,
                        'pl-7 bg-red-400X': table.getRowModel().rows?.length === 0 && !isLoading,
                      })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: pageSize }).map((_) => (
                  <TableRow className="h-16 w-full bg-red-400X hover:bg-transparent">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <TableCell
                        key={index}
                        className={clsx(['py-2 md:py-3'], {
                          'pr-0': index === 0,
                        })}
                      >
                        <Skeleton className={'w-full h-6'} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={cell.id}
                          className={clsx(['py-2 md:py-3'], {
                            'pr-0': index === 0,
                          })}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <>
                    {!isLoading && (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No teams
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center gap-4 md:gap-6">
        {/* {data && data?.totalCount > 0 && table.getFilteredRowModel().rows.length > 0 && ( */}
        {/*   <span className="flex items-center gap-1 text-sm text-muted-foreground"> */}
        {/*     <div>Page</div> */}
        {/*     <span className=""> */}
        {/*       {/* {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} */}
        {/*       {table.getState().pagination.pageIndex + 1} {`of `} */}
        {/*       {Math.ceil(table.getFilteredRowModel().rows.length / pageSize)} */}
        {/*     </span> */}
        {/*   </span> */}
        {/* )} */}
        {/**/}
        <div
          className={clsx(
            [
              'hidden md:flex gap-0 items-center text-sm mt-0 text-muted-foreground rounded-md border-2',
            ],
            {
              'opacity-70': table.getFilteredRowModel().rows.length <= 5,
            }
          )}
        >
          {[5, 10].map((val, _) => (
            <button
              disabled={isLoading || table.getFilteredRowModel().rows.length <= 5}
              onClick={() => {
                setPagination((s) => {
                  return { ...s, pageSize: val }
                })
              }}
              className={clsx(['w-10 text-center py-1 ease duration-200'], {
                'bg-secondary text-primary': pageSize === val,
                'opacity-50 hover:opacity-100': pageSize !== val,
                'rounded-l-sm rounded-r-sm': true,
              })}
            >
              {val}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={
              !table.getCanPreviousPage() ||
              table.getState().pagination.pageIndex + 1 >
                Math.ceil(table.getFilteredRowModel().rows.length / pageSize)
            }
          >
            <Icons.chevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={
              !table.getCanPreviousPage() ||
              table.getState().pagination.pageIndex + 1 >
                Math.ceil(table.getFilteredRowModel().rows.length / pageSize)
            }
          >
            <Icons.chevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={
              !table.getCanNextPage() ||
              table.getState().pagination.pageIndex + 1 >=
                Math.ceil(table.getFilteredRowModel().rows.length / pageSize)
            }
          >
            <Icons.chevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={
              !table.getCanNextPage() ||
              table.getState().pagination.pageIndex + 1 >=
                Math.ceil(table.getFilteredRowModel().rows.length / pageSize)
            }
          >
            <Icons.chevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TeamsTable
