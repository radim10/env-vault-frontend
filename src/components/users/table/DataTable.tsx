'use client'

import { useMemo, useState } from 'react'
import { produce } from 'immer'
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
import { useGetWorkspaceUsers } from '@/api/queries/users'
import { WorkspaceUser, WorkspaceUserRole } from '@/types/users'
import { Skeleton } from '@/components/ui/skeleton'
import TableToolbar from '../TableToolbar'
import { useDebounce, useUpdateEffect } from 'react-use'
import DeleteWorkspaceUserDialog from '../DeleteUserDialog'
import { QueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import UpdateWorkspaceUserRoleDialog from '../UpdateUserRoleDialog'
import useUserTablesPaginationStore from '@/stores/userTables'

interface DataTableProps {
  workspaceId: string
  columns: ColumnDef<WorkspaceUser>[]
  queryClient: QueryClient
  onInviteUser: () => void
}

function UsersDataTable({ columns, workspaceId, queryClient, onInviteUser }: DataTableProps) {
  const { toast } = useToast()
  const { workspacePageSize, setWorkspacePageSize } = useUserTablesPaginationStore()

  // const [pagesLoaded, setPagesLoaded] = useState<number[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [totalSearchCount, setTotalSearchCount] = useState<number>(0)

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: workspacePageSize ?? 5,
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

  const [search, setSearch] = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const fetchDataOptions = {
    workspaceId,
    page: pageIndex,
    pageSize: pageSize,
    sort: (sorting?.[0]?.id === 'joinedAt' ? 'joined' : sorting?.[0]?.id) as any,
    desc: sorting?.[0]?.desc ?? undefined,
    search: search?.trim()?.length > 1 ? search : undefined,
  }

  const getCurrentKey = () => [
    'workspace',
    workspaceId,
    'users',
    fetchDataOptions.pageSize,
    fetchDataOptions.page,
    fetchDataOptions.sort,
    fetchDataOptions.desc,
    fetchDataOptions.search,
  ]

  const { data, isLoading, isFetching, refetch, isRefetching } = useGetWorkspaceUsers(
    fetchDataOptions,
    {
      keepPreviousData: false,
      enabled: !searchActive,
      // leave it here???
      // staleTime: Infinity,
      onSuccess: (data) => {
        setSearchLoading(false)

        if (search?.trim()?.length < 2) {
          if (totalCount !== data?.totalCount) {
            setTotalCount(data?.totalCount)
          }
        } else {
          setTotalSearchCount(data?.totalCount)
        }
      },
    }
  )

  useUpdateEffect(() => {
    if (pageSize !== workspacePageSize) {
      setWorkspacePageSize(pageSize)
    }

    if (search?.length > 1) {
      refetch()
    }
  }, [pageSize])


  useUpdateEffect(() => {
    if (search?.length === 0) {
      setSearchActive(false)
    } else {
      setSearchActive(true)
    }

    if (search?.trim()?.length > 1) {
      setSearchLoading(true)
    } else {
      setSearchLoading(false)
    }
  }, [search])

  useUpdateEffect(() => {
    refetch()
  }, [sorting])

  useUpdateEffect(() => {
    if (search?.trim()?.length > 1) refetch()
  }, [pagination?.pageIndex])

  useDebounce(
    () => {
      if (search?.trim()?.length > 1) {
        if (pagination?.pageIndex === 0) {
          refetch()
        } else {
          setPagination({ pageSize: 5, pageIndex: 0 })
        }
      }
    },
    500,
    [search]
  )

  // useUpdateEffect(() => {
  //   if (pagesLoaded?.length === table.getPageCount() && pagesLoaded?.length > 0) {
  //     alert('all pages loaded')
  //   }
  // }, [pagesLoaded])

  // useUpdateEffect(() => {
  //   refetch()
  // }, [pageIndex, sorting])
  //
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
      const newUsers = produce(data, (draftData) => {
        const itemIndex = data.data.findIndex((item) => item.id === userId)
        if (itemIndex !== -1) {
          draftData.data.splice(itemIndex, 1)
        }
      })

      queryClient.setQueryData(currentKey, {
        ...data,
        data: newUsers,
      })

      if (newUsers?.data?.length === 0)
        setPagination(produce(pagination, (draftPagination) => {
          draftPagination.pageIndex = draftPagination.pageIndex - 1
        }))
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
      const updatedUsers = produce(data, (draftData) => {
        const itemIndex = data.data.findIndex((item) => item.id === userId)
        if (itemIndex !== -1) {
          draftData.data[itemIndex].role = newRole
        }
      })

      queryClient.setQueryData(currentKey, updatedUsers)
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
    pageCount:
      search?.trim()?.length > 1
        ? Math.ceil(totalSearchCount / pageSize)
        : totalCount
          ? Math.ceil(totalCount / pageSize)
          : undefined,
    data: data?.data ?? defaultData,
    columns,
    meta: {
      deleteUser: handleDeleteUser,
      updateRole: handleUpdateUserRole,
    },
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    onSortingChange: (sorting) => {
      if (searchActive) {
        if (totalSearchCount > 1) setSorting(sorting)
      } else setSorting(sorting)
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    debugTable: true,
    enableSorting:
      !isFetching || (search?.trim().length > 1 ? totalSearchCount > 1 : totalCount > 1),
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

      <TableToolbar

        userCount={
          !totalCount || searchLoading
            ? null
            : search?.trim()?.length > 1
              ? totalSearchCount
              : totalCount
        }
        isSearchCount={search?.trim()?.length > 1}
        search={search}
        loading={isLoading}
        onSearch={setSearch}
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
                        'bg-red-500X  w-8': index === 0,
                        'md:w-[27%]': index === 2 || index === 1,
                        'md:w-36 2xl:w-56 bg-red-300X': index === 3,
                        'pl-7 bg-red-400X':
                          table.getRowModel().rows?.length === 0 && !searchLoading && !isLoading,
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
            {isLoading || searchLoading ? (
              <>
                {Array.from({ length: pageSize }).map((row) => (
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
      <div className="flex justify-end items-center gap-4 md:gap-6">
        {/* <div className="text-muted-foreground text-sm">Pages: {Math.ceil(2 / 5)}/1</div> */}
        {(search?.trim()?.length > 1 ? totalSearchCount !== 0 : totalCount !== 0) && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <div>Page</div>
            <span className="">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </span>
        )}

        <div className={clsx(['hidden md:flex gap-0 items-center text-sm mt-0 text-muted-foreground rounded-md border-2'], {
          'opacity-70': isLoading || searchLoading || (search?.trim()?.length > 1 ? totalSearchCount < 5 : totalCount < 5),
        })}>
          {[5, 10].map((val, _) => (
            <button
              disabled={isLoading || searchLoading || (search?.trim()?.length > 1 ? totalSearchCount < 5 : totalCount < 5)}
              onClick={() => {
                setPagination((s) => {
                  return { ...s, pageSize: val }
                })
              }}
              className={clsx(['w-10 text-center py-1 ease duration-200'], {
                'bg-secondary text-primary': pageSize === val,
                'opacity-50 hover:opacity-100': pageSize !== val,
                'rounded-l-sm rounded-r-sm': true,
              })}>
              {val}
            </button>
          ))}
        </div>

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

export default UsersDataTable
