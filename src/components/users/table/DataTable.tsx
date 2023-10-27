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
import { useGetWorkspaceUsers } from '@/api/queries/users'
import { WorkspaceUser } from '@/types/users'
import { Skeleton } from '@/components/ui/skeleton'
import TableToolbar from '../TableToolbar'

interface DataTableProps {
  workspaceId: string
  columns: ColumnDef<WorkspaceUser>[]
}

function UsersDataTable({ columns, workspaceId }: DataTableProps) {
  // const [pagesLoaded, setPagesLoaded] = useState<number[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)

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

  const [sorting, setSorting] = useState<SortingState>([])

  const fetchDataOptions = {
    page: pageIndex,
    sort: (sorting?.[0]?.id === 'joinedAt' ? 'joined' : sorting?.[0]?.id) as any,
    desc: sorting?.[0]?.desc ?? undefined,
  }

  const { data, isLoading, isFetching } = useGetWorkspaceUsers(
    { workspaceId, ...fetchDataOptions },
    {
      keepPreviousData: false,
      staleTime: Infinity,
      onSuccess: (data) => {
        if (totalCount !== data?.totalCount) {
          setTotalCount(data?.totalCount)
        }
      },
      //   onSuccess: () =>
      //     setPagesLoaded((prev) => {
      //       const unique = [...prev, pageIndex]
      //       return Array.from(new Set(unique))
      //     }),
    }
  )

  // useUpdateEffect(() => {
  //   if (pagesLoaded?.length === table.getPageCount() && pagesLoaded?.length > 0) {
  //     alert('all pages loaded')
  //   }
  // }, [pagesLoaded])

  // useUpdateEffect(() => {
  //   refetch()
  // }, [pageIndex, sorting])

  const table = useReactTable({
    pageCount: totalCount ? Math.ceil(totalCount / 5) : undefined,
    data: data?.data ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    // getSortedRowModel: getSortedRowModel(),
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
      <TableToolbar userCount={totalCount} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={clsx({
                        'bg-red-500X  w-8': index === 0,
                        'md:w-[27%]': index === 2 || index === 1,
                        'md:w-36 2xl:w-56 bg-red-300X': index === 3,
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
            {isLoading && (
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
            )}
            {!isLoading && (
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
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}

                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          Loading
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
        {table.getPageCount() !== 0 && (
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

export default UsersDataTable
