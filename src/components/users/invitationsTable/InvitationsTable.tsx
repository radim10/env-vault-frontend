'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
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
import { WorkspaceInvitation, WorkspaceUser, WorkspaceUserRole } from '@/types/users'
import { Skeleton } from '@/components/ui/skeleton'
import TableToolbar from '../TableToolbar'
import { useUpdateEffect } from 'react-use'
import { QueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import DeleteWorkspaceInvitationDialog from '../DeleteInvitationDialog'

interface DataTableProps {
  workspaceId: string
  columns: ColumnDef<WorkspaceInvitation>[]
  queryClient: QueryClient
  onInviteUser: () => void
}

function InvitationsTable({ columns, workspaceId, queryClient, onInviteUser }: DataTableProps) {
  const { toast } = useToast()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const defaultData = useMemo(() => [], [])

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'name',
      desc: false,
    },
  ])

  const fetchDataOptions = {
    page: pageIndex,
    sort: (sorting?.[0]?.id === 'joinedAt' ? 'joined' : sorting?.[0]?.id) as any,
    desc: sorting?.[0]?.desc ?? undefined,
  }

  const getCurrentKey = () => [
    'workspace',
    workspaceId,
    'users',
    fetchDataOptions.page,
    fetchDataOptions.sort,
    fetchDataOptions.desc,
  ]

  const { data, isLoading, isFetching, refetch, isRefetching } = useListWorkspaceInvitations(
    { workspaceId, ...fetchDataOptions },
    {
      keepPreviousData: false,
      // leave it here???
      // staleTime: Infinity,
      onSuccess: (data) => { },
    }
  )

  useUpdateEffect(() => {
    refetch()
  }, [sorting])

  const [deleteInvitationDialog, setDeleteInvitationDialog] = useState<Pick<
    WorkspaceInvitation,
    'id' | 'role' | 'email'
  > | null>(null)

  const handleDeleteInvitation = (args: Pick<WorkspaceInvitation, 'id' | 'role' | 'email'>) => {
    setDeleteInvitationDialog(args)
  }

  const handleResendInvitation = (id: string) => {
    alert(id)
  }

  const handleDeletedInvitation = (invitationId: string) => {
    const currentKey = ['workspace-invitations', workspaceId]
    const data = queryClient.getQueryData<WorkspaceInvitation[]>(currentKey)

    if (data) {
      const newInvitations = [...data].filter((item) => item.id !== invitationId)
      queryClient.setQueryData(
        currentKey,
        //
        newInvitations
      )

      if (newInvitations?.length === 0)
        setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })
    }

    closeDeleteDialog()

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

  const handleUpdatedUser = (userId: string, newRole: WorkspaceUserRole) => {
    const currentKey = getCurrentKey()
    const data = queryClient.getQueryData<{ data: WorkspaceUser[]; totalCount: number }>(currentKey)

    if (data) {
      const newUsers = [...data.data]
      const updatedUserIndex = newUsers.findIndex((item) => item.id === userId)

      if (updatedUserIndex !== -1) {
        const updatedUser = newUsers[updatedUserIndex]
        newUsers[updatedUserIndex] = { ...updatedUser, role: newRole }

        queryClient.setQueryData(currentKey, {
          ...data,
          data: newUsers,
        })
      }
    }

    toast({
      title: 'User role has been updated',
      variant: 'success',
    })
  }

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.length / pageSize) : undefined,
    data: data ?? defaultData,
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
    manualPagination: true,
    manualSorting: true,
    debugTable: true,
    enableSorting: !isFetching,
    state: {
      sorting,
      pagination,
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
        userCount={data !== undefined ? data?.length : null}
        isInvitations={true}
        isSearchCount={false}
        search={''}
        loading={isLoading}
        onSearch={() => { }}
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
                {Array.from({ length: 5 }).map((_) => (
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
                          No results
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
      <div className="flex justify-end items-center gap-4">
        {/* <div className="text-muted-foreground text-sm">Pages: {Math.ceil(2 / 5)}/1</div> */}
        {data && data?.length > 0 && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <div>Page</div>
            <span className="">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </span>
        )}

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <Icons.chevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <Icons.chevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <Icons.chevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <Icons.chevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InvitationsTable
