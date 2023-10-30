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
import { useGetWorkspaceUsers, useListWorkspaceInvitations } from '@/api/queries/users'
import { WorkspaceInvitation, WorkspaceUser, WorkspaceUserRole } from '@/types/users'
import { Skeleton } from '@/components/ui/skeleton'
import TableToolbar from '../TableToolbar'
import { useDebounce, useUpdateEffect } from 'react-use'
import DeleteWorkspaceUserDialog from '../DeleteUserDialog'
import { QueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import UpdateWorkspaceUserRoleDialog from '../UpdateUserRoleDialog'
import TypographyH4 from '@/components/typography/TypographyH4'

interface DataTableProps {
  workspaceId: string
  columns: ColumnDef<WorkspaceInvitation>[]
  queryClient: QueryClient
  onInviteUser: () => void
}

function InvitationsTable({ columns, workspaceId, queryClient, onInviteUser }: DataTableProps) {
  const { toast } = useToast()
  // const [pagesLoaded, setPagesLoaded] = useState<number[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [totalSearchCount, setTotalSearchCount] = useState<number>(0)

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

  const [deleteUserDialog, setDeleteUserDialog] = useState<{
    id: string
    name: string
  } | null>(null)

  const handleDeleteUser = (args: { id: string; name: string }) => {
    setDeleteUserDialog(args)
  }

  const handleDeletedUser = (userId: string) => {
    const currentKey = getCurrentKey()
    const data = queryClient.getQueryData<{ data: WorkspaceUser[]; totalCount: number }>(currentKey)

    if (data) {
      const newUsers = [...data.data].filter((item) => item.id !== userId)
      queryClient.setQueryData(currentKey, {
        ...data,
        data: newUsers,
      })

      if (newUsers?.length === 0)
        setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })
    }

    queryClient.invalidateQueries(['workspace', workspaceId, 'users'], { exact: false })

    setTotalCount(totalCount - 1)
    closeDeleteDialog()

    toast({
      title: 'User has been deleted',
      variant: 'success',
    })
  }

  const closeDeleteDialog = () => {
    if (!deleteUserDialog) return

    setDeleteUserDialog({ ...deleteUserDialog, id: '' })
    setTimeout(() => {
      setDeleteUserDialog(null)
    }, 150)
  }

  const [roleDialog, setRoleDialog] = useState<{
    id: string
    name: string
    role: WorkspaceUserRole
  } | null>(null)

  const handleUpdateUserRole = (args: { id: string; name: string; role: WorkspaceUserRole }) => {
    setRoleDialog(args)
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

    closeRoleDialog()

    toast({
      title: 'User role has been updated',
      variant: 'success',
    })
  }

  const closeRoleDialog = () => {
    if (!roleDialog) return

    setRoleDialog({ ...roleDialog, id: '' })
    setTimeout(() => {
      setRoleDialog(null)
    }, 150)
  }

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.length / pageSize) : undefined,
    data: data ?? defaultData,
    columns,
    meta: {
      deleteUser: handleDeleteUser,
      updateRole: handleUpdateUserRole,
    },
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
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
      {deleteUserDialog && (
        <DeleteWorkspaceUserDialog
          workspaceId={workspaceId}
          opened={deleteUserDialog?.id !== ''}
          user={deleteUserDialog}
          onClose={closeDeleteDialog}
          onSuccess={() => handleDeletedUser(deleteUserDialog.id)}
        />
      )}
      {roleDialog && (
        <UpdateWorkspaceUserRoleDialog
          user={roleDialog}
          opened={roleDialog?.id !== ''}
          workspaceId={workspaceId}
          onClose={closeRoleDialog}
          onSuccess={(newRole) => handleUpdatedUser(roleDialog.id, newRole)}
        />
      )}
      {/* <div className="text-muted-foreground font-medium mb-3">Invitations</div> */}

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
                {Array.from({ length: 5 }).map((row) => (
                  <TableRow className="h-16 w-full bg-red-400X hover:bg-transparent">
                    {Array.from({ length: 6 }).map((cell, index) => (
                      <TableCell
                        key={index}
                        className={clsx(['py-2 md:py-3'], {
                          'pr-0': index === 0,
                        })}
                      >
                        <Skeleton
                          className={clsx(['w-full'], {
                            'h-6 w-full': index !== 0,
                            'w-10 h-10 rounded-full': index === 0,
                          })}
                        />
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
