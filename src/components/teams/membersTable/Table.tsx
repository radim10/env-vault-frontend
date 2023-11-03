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
import { User, WorkspaceUser, WorkspaceUserRole } from '@/types/users'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce, useUpdateEffect } from 'react-use'
import { QueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import useUserTablesPaginationStore from '@/stores/userTables'
import TableToolbar from '@/components/users/TableToolbar'
import { useGetTeamMembers } from '@/api/queries/teams'
import ActionTableToolbar from '@/components/ActionTableToolbar'
import DeleteMembersDialog from '../DeleteMembersDialog'

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

  const handleDeletedUsers = () => {
    //invalidateQueries
    queryClient.invalidateQueries(['workspace', workspaceId, 'team-members'], { exact: false })
    setRowSelection({})
    closeDeleteDialog()

    toast({
      title: 'Users have been deleted',
      variant: 'success',
    })
  }

  const closeDeleteDialog = () => {
    if (!deleteMembersDialog) return

    setDeleteMembersDialog({ opened: false })
    setTimeout(() => {
      setDeleteMembersDialog(null)
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
    meta: {},
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
      {deleteMembersDialog !== null && (
        <DeleteMembersDialog
          teamId={teamId}
          workspaceId={workspaceId}
          opened={deleteMembersDialog?.opened === true}
          onClose={closeDeleteDialog}
          onSuccess={() => handleDeletedUsers()}
          userIds={Object.keys(rowSelection)}
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
                        'w-1': index === 0,
                        'bg-red-500X  w-6': index === 1,
                        'md:w-[40%]': index === 2 || index === 3,
                        // 'md:w-[27%]': index === 2 || index === 1,
                        // 'md:w-36 2xl:w-56 bg-red-300X': index === 3,
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

        <div
          className={clsx(
            [
              'hidden md:flex gap-0 items-center text-sm mt-0 text-muted-foreground rounded-md border-2',
            ],
            {
              'opacity-70':
                isLoading ||
                searchLoading ||
                (search?.trim()?.length > 1 ? totalSearchCount <= 5 : totalCount <= 5),
            }
          )}
        >
          {[5, 10].map((val, _) => (
            <button
              disabled={
                isLoading ||
                searchLoading ||
                (search?.trim()?.length > 1 ? totalSearchCount <= 5 : totalCount <= 5)
              }
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

export default TeamMembersTable
