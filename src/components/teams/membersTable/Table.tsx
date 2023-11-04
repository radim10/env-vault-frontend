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
import { User } from '@/types/users'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce, useUpdateEffect } from 'react-use'
import { QueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import useUserTablesPaginationStore from '@/stores/userTables'
import TableToolbar from '@/components/users/TableToolbar'
import { useGetTeamMembers } from '@/api/queries/teams'
import ActionTableToolbar from '@/components/ActionTableToolbar'
import DeleteMembersDialog from '../DeleteMembersDialog'
import TableFooter from '@/components/tables/TableFooter'

interface DataTableProps {
  workspaceId: string
  teamId: string
  columns: ColumnDef<User>[]
  queryClient: QueryClient
  onAddMembers: () => void
}

function TeamMembersTable({
  columns,
  workspaceId,
  teamId,
  queryClient,
  onAddMembers,
}: DataTableProps) {
  const { toast } = useToast()
  const { workspacePageSize, setWorkspacePageSize } = useUserTablesPaginationStore()

  // const [pagesLoaded, setPagesLoaded] = useState<number[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [totalSearchCount, setTotalSearchCount] = useState<number>(0)
  const [rowSelection, setRowSelection] = useState({})

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
    teamId,
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

  const { data, isLoading, isFetching, refetch, isRefetching } = useGetTeamMembers(
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

  const [deleteMembersDialog, setDeleteMembersDialog] = useState<{
    opened: boolean
  } | null>(null)

  const handleDeletedUsers = (multiple: boolean) => {
    //invalidateQueries
    queryClient.invalidateQueries(['workspace', workspaceId, 'team-members'], { exact: false })

    if (search?.trim()?.length > 1) {
      refetch()
    }

    if (multiple) {
      setRowSelection({})
      closeDeleteMembersDialog()
    } else {
      closeDeleteSingleMemberDialog()
    }

    toast({
      title: multiple ? 'Users have been deleted' : 'User have been deleted',
      variant: 'success',
    })
  }

  const closeDeleteMembersDialog = () => {
    if (!deleteMembersDialog) return

    setDeleteMembersDialog({ opened: false })
    setTimeout(() => {
      setDeleteMembersDialog(null)
    }, 150)
  }

  const [deleteSingleMemberDialog, setDeleteSingleMemberDialog] = useState<{
    id: string
    name: string
  } | null>(null)

  const handleDeleteUser = (args: { id: string; name: string }) => {
    setDeleteSingleMemberDialog(args)
  }

  const closeDeleteSingleMemberDialog = () => {
    if (!deleteSingleMemberDialog) return

    setDeleteSingleMemberDialog({ ...deleteSingleMemberDialog, id: '' })
    setTimeout(() => {
      setDeleteSingleMemberDialog(null)
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
      // showUser: () =>{}
      deleteUser: handleDeleteUser,
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
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    debugTable: true,
    autoResetAll: false,
    getRowId: (row) => {
      return row.id
    },

    enableSorting:
      !isFetching || (search?.trim().length > 1 ? totalSearchCount > 1 : totalCount > 1),
    state: {
      sorting,
      pagination,
      rowSelection,
    },
  })

  return (
    <div>
      {(deleteMembersDialog !== null || deleteSingleMemberDialog !== null) && (
        <DeleteMembersDialog
          teamId={teamId}
          workspaceId={workspaceId}
          opened={
            deleteMembersDialog?.opened === true ||
            (deleteSingleMemberDialog && deleteSingleMemberDialog?.id !== '')
              ? true
              : false
          }
          onClose={() => {
            if (deleteMembersDialog) {
              closeDeleteMembersDialog()
            } else {
              closeDeleteSingleMemberDialog()
            }
          }}
          onSuccess={() => handleDeletedUsers(deleteMembersDialog !== null)}
          userName={deleteSingleMemberDialog?.name}
          userIds={
            !deleteSingleMemberDialog ? Object.keys(rowSelection) : [deleteSingleMemberDialog.id]
          }
        />
      )}

      {/* <button onClick={() => console.log(rowSelection)}>DEBUG selection</button> */}
      {Object.keys(rowSelection).length === 0 ? (
        <TableToolbar
          isTeam
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
          onInviteUser={onAddMembers}
        />
      ) : (
        <div className="mt-1">
          <ActionTableToolbar
            totalCount={
              !totalCount || searchLoading
                ? 0
                : search?.trim()?.length > 1
                ? totalSearchCount
                : totalCount
            }
            // selectedCount={table.getFilteredSelectedRowModel().rows.length}
            selectedCount={Object.keys(rowSelection).length}
            onCancel={() => setRowSelection({})}
            onDelete={() => setDeleteMembersDialog({ opened: true })}
          />
        </div>
      )}
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
                        // 'w-1': index === 0,
                        // 'bg-red-500X  w-2': index === 1,
                        'md:w-[50%]': index === 1 || index === 2,
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
                    {Array.from({ length: 3 }).map((cell, index) => (
                      <TableCell
                        key={index}
                        className={clsx(['py-2 md:py-3'], {
                          'pr-0': index === 0,
                        })}
                      >
                        {index === 1 && (
                          <div className="flex items-center gap-5 w-full">
                            <Skeleton
                              className={clsx(['w-full'], {
                                'w-10 h-10 rounded-full': true,
                              })}
                            />
                            <Skeleton className="w-[85%] h-6" />
                          </div>
                        )}
                        {index !== 1 && (
                          <Skeleton
                            className={clsx(['w-full'], {
                              'h-6 w-full': index !== 0,
                              'h-5 w-5': index === 0,
                            })}
                          />
                        )}
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
          hidden: !(search?.trim()?.length > 1 ? totalSearchCount > 0 : totalCount > 0),
          current: table.getState().pagination.pageIndex + 1,
          total: table.getPageCount(),
        }}
        pageSize={{
          value: pageSize,
          disabled:
            isLoading ||
            searchLoading ||
            (search?.trim()?.length > 1 ? totalSearchCount <= 5 : totalCount <= 5),
          onChange: (pageSize) => {
            setPagination((p) => {
              return { ...p, pageSize }
            })
          },
        }}
      />
    </div>
  )
}

export default TeamMembersTable
