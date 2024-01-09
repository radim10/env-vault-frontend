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
import TableFooter from '@/components/tables/TableFooter'
import { useRouter } from 'next/navigation'
import TableError from '@/components/TableError'
import { usersErrorMsgFromCode } from '@/api/requests/users'
import useCurrentUserStore from '@/stores/user'

interface DataTableProps {
  workspaceId: string
  columns: ColumnDef<WorkspaceUser>[]
  queryClient: QueryClient
  onInviteUser?: () => void
}

function UsersDataTable({ columns, workspaceId, queryClient, onInviteUser }: DataTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { workspacePageSize, setWorkspacePageSize } = useUserTablesPaginationStore()
  const {
    data: currentUser,
    isFreeWorkspacePlan,
    isStartupWorkspacePlan,
    updateExceedingUsers,
  } = useCurrentUserStore()

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

  const { data, isLoading, isFetching, refetch, isRefetching, error } = useGetWorkspaceUsers(
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

        const exceedingUserCount = currentUser?.selectedWorkspace?.exceedingUserCount
        //
        if (exceedingUserCount) {
          let newExceedingCount = 0

          if (isFreeWorkspacePlan()) {
            newExceedingCount = data?.totalCount - 5
          }
          if (isStartupWorkspacePlan()) {
            newExceedingCount = data?.totalCount - 50
          }

          if (newExceedingCount >= 0 && newExceedingCount !== exceedingUserCount) {
            updateExceedingUsers(newExceedingCount === 0 ? null : newExceedingCount)
          }
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
        setPagination(
          produce(pagination, (draftPagination) => {
            draftPagination.pageIndex = draftPagination.pageIndex - 1
          })
        )

      const exceedingUserCount = currentUser?.selectedWorkspace?.exceedingUserCount
      //
      if (exceedingUserCount) {
        updateExceedingUsers(exceedingUserCount === 1 ? null : exceedingUserCount - 1)
      }
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

  const handleShowProfile = (id: string) => {
    router.push(`/workspace/${workspaceId}/user/${id}/profile`)
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
      showProfile: handleShowProfile,
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

  if (error) {
    return (
      <>
        <TableError
          className="mt-20"
          description={usersErrorMsgFromCode(error?.code) ?? 'Failed to load users'}
          actionBtn={{
            text: 'Try again',
            className: 'px-6',
            onClick: () => refetch(),
          }}
        />
      </>
    )
  }

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
        userLimitReached={
          (isFreeWorkspacePlan() && totalCount >= 5) ||
          (isStartupWorkspacePlan() && totalCount >= 50)
        }
        count={
          !totalCount || searchLoading
            ? null
            : search?.trim()?.length > 1
            ? totalSearchCount
            : totalCount
        }
        entity="users"
        isSearchCount={search?.trim()?.length > 1}
        search={search}
        loading={isLoading}
        onSearch={setSearch}
        hideSubmit={!onInviteUser}
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
                        'md:w-44 2xl:w-56 bg-red-300X': index === 3 && onInviteUser,
                        'md:w-[16%] bg-red-300X': index === 3 && !onInviteUser,
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

      <TableFooter
        className="py-4"
        pagination={{
          toStart: {
            onClick: () => table.setPageIndex(0),
            disabled: !table.getCanPreviousPage(),
          },
          toEnd: {
            onClick: () => table.setPageIndex(table.getPageCount() - 1),
            disabled: !table.getCanNextPage(),
          },
          prev: {
            onClick: () => table.previousPage(),
            disabled: !table.getCanPreviousPage(),
          },
          next: {
            onClick: () => table.nextPage(),
            disabled: !table.getCanNextPage(),
          },
        }}
        page={{
          hidden: !(search?.trim()?.length > 1 ? totalSearchCount !== 0 : totalCount !== 0),
          current: pagination?.pageIndex + 1,
          total: table.getPageCount(),
        }}
        pageSize={{
          value: pageSize,
          disabled:
            isLoading ||
            searchLoading ||
            (search?.trim()?.length > 1 ? totalSearchCount < 5 : totalCount < 5),
          onChange: (pageSize) => {
            setPagination((p) => {
              const currentPage = p.pageIndex + 1

              if (pageSize === 10 && currentPage === table.getPageCount()) {
                return { pageIndex: p.pageIndex - 1, pageSize }
              } else {
                return { pageIndex: p.pageIndex, pageSize }
              }
            })
          },
        }}
      />
    </div>
  )
}

export default UsersDataTable
