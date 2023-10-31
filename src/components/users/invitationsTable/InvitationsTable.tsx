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
import { WorkspaceInvitation } from '@/types/users'
import { Skeleton } from '@/components/ui/skeleton'
import TableToolbar from '../TableToolbar'
import { useUpdateEffect } from 'react-use'
import { QueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import DeleteWorkspaceInvitationDialog from '../DeleteInvitationDialog'
import { invitationsStore } from '@/stores/invitations'
import { useResendWorkspaceInvitation } from '@/api/mutations/users'
import { ListWorkspaceInvitationsData } from '@/api/requests/users'
import useUserTablesPaginationStore from '@/stores/userTables'

interface DataTableProps {
  workspaceId: string
  columns: ColumnDef<WorkspaceInvitation>[]
  queryClient: QueryClient
  onInviteUser: () => void
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

function InvitationsTable({ columns, workspaceId, queryClient, onInviteUser }: DataTableProps) {
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
      id: 'created',
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

  const { data, isLoading, isFetching, refetch } = useListWorkspaceInvitations(fetchDataOptions, {
    keepPreviousData: false,
    // leave it here???
    // staleTime: Infinity,
  })

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

  const [deleteInvitationDialog, setDeleteInvitationDialog] = useState<Pick<
    WorkspaceInvitation,
    'id' | 'role' | 'email'
  > | null>(null)

  const handleDeleteInvitation = (args: Pick<WorkspaceInvitation, 'id' | 'role' | 'email'>) => {
    setDeleteInvitationDialog(args)
  }

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
    const currentKey = getCurrentKey()
    const data = queryClient.getQueryData<WorkspaceInvitation[]>(currentKey)

    if (data) {
      const updData = produce(data, (draftData) => {
        const itemIndex = data.findIndex((item) => item.id === invitationId)

        if (itemIndex !== -1) {
          draftData[itemIndex].lastSentAt = new Date()
        }
      })

      queryClient.setQueryData(currentKey, updData)
    }
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
    closeDeleteDialog()
    //
    toast({
      title: 'Invitation has been deleted',
      variant: 'success',
    })
  }

  const closeDeleteDialog = () => {
    if (!deleteInvitationDialog) return

    setDeleteInvitationDialog({ ...deleteInvitationDialog, id: '' })
    setTimeout(() => {
      setDeleteInvitationDialog(null)
    }, 150)
  }

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.totalCount / pageSize) : undefined,
    data: data?.data ?? defaultData,
    columns,
    meta: {
      delete: handleDeleteInvitation,
      resend: handleResendInvitation,
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
    enableSorting: !isFetching,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  })

  return (
    <div>
      {deleteInvitationDialog && (
        <DeleteWorkspaceInvitationDialog
          workspaceId={workspaceId}
          opened={deleteInvitationDialog?.id !== ''}
          invitation={deleteInvitationDialog}
          onClose={closeDeleteDialog}
          onSuccess={() => handleDeletedInvitation(deleteInvitationDialog.id)}
        />
      )}
      {/* <div className="text-muted-foreground font-medium mb-3">Invitations</div> */}
      <TableToolbar
        userCount={
          data !== undefined
            ? (table.getColumn('email')?.getFilterValue() as string)?.length > 0
              ? table.getFilteredRowModel().rows.length
              : data?.totalCount
            : null
        }
        loading={isLoading}
        isInvitations={true}
        isSearchCount={(table.getColumn('email')?.getFilterValue() as string)?.length > 0}
        search={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
        onSearch={(value) => {
          table.getColumn('email')?.setFilterValue(value)
        }}
        onInviteUser={onInviteUser}
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
                        'bg-red-500X  md:w-[23.5%]': index === 0,
                        'md:w-[29%]': index === 1,
                        'md:w-36 2xl:w-44 bg-red-300X': index === 2,
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
                    {Array.from({ length: 5 }).map((_, index) => (
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
                  table.getRowModel().rows.map((row) => (
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
                          No invitations
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
        {/* <div className="flex-1 text-sm text-muted-foreground"> */}
        {/* {table.getFilteredRowModel().rows.length} */}
        {/* </div> */}
        {/* <div className="text-muted-foreground text-sm">Pages: {Math.ceil(2 / 5)}/1</div> */}
        {data && data?.totalCount > 0 && table.getFilteredRowModel().rows.length > 0 && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <div>Page</div>
            <span className="">
              {/* {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} */}
              {table.getState().pagination.pageIndex + 1} {`of `}
              {Math.ceil(table.getFilteredRowModel().rows.length / pageSize)}
            </span>
          </span>
        )}

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

export default InvitationsTable
