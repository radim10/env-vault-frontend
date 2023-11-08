import clsx from 'clsx'
import { produce } from 'immer'
import { useMemo, useState } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { ListTeam } from '@/types/teams'
import { useRouter } from 'next/navigation'
import TableFooter from '@/components/tables/TableFooter'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import TableToolbar from '@/components/users/TableToolbar'
import { useGetUserAccessProjects, useGetUserAccessTeamProjects } from '@/api/queries/users'
import { UserAccessProject, UserAccessTeamProject } from '@/types/userAccess'
import TypographyH4 from '@/components/typography/TypographyH4'
import { Icons } from '@/components/icons'

interface DataTableProps {
  workspaceId: string
  userId: string
  columns: ColumnDef<UserAccessTeamProject>[]
}

const UserAccessTeamTable: React.FC<DataTableProps> = ({ columns, userId, workspaceId }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const router = useRouter()
  const defaultData = useMemo(() => [], [])

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

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'name',
      desc: false,
    },
  ])

  const { data, isLoading, error } = useGetUserAccessTeamProjects({
    workspaceId,
    userId,
  })

  const getCurrentKey = () => ['workspace', workspaceId, 'user', userId, 'access-user']

  const handleGotoProject = (projectName: string) => {
    router.push(`/workspace/${workspaceId}/projects/${projectName}/environments`)
  }

  const handleGotoTeam = (teamId: string) => {
    router.push(`/workspace/${workspaceId}/teams/${teamId}/members`)
  }

  const sortTeams = (
    teams: ListTeam[],
    sort: 'membersCount' | 'name',
    desc: boolean
  ): ListTeam[] => {
    if (sort === 'membersCount') {
      return teams.sort(function (a, b) {
        const countCompare = desc
          ? b.membersCount - a.membersCount
          : a.membersCount - b.membersCount
        return countCompare || a.name.localeCompare(b.name)
      })
    } else {
      return teams.sort(function (a, b) {
        return desc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      })
    }
  }

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.length / pageSize) : undefined,
    data: data ?? defaultData,
    columns,
    meta: {
      gotoProject: handleGotoProject,
      gotoTeam: handleGotoTeam,
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
    enableSorting: !isLoading,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  })

  return (
    <div className="rounded-md border">
      <div className="px-3 pt-3 md:px-5 md:pt-4">
        <div className="gap-3 flex items-center">
          <TypographyH4>Team access</TypographyH4>
          <Icons.users2 className="h-5 w-5 opacity-80" />
        </div>
      </div>

      <div className="pl-3 md:pl-5 pr-1 md:pr-3">
        <TableToolbar
          hideSubmit
          count={table.getRowModel().rows.length ?? null}
          loading={isLoading}
          entity="user-access"
          isSearchCount={(table.getColumn('name')?.getFilterValue() as string)?.length > 0}
          search={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onSearch={(value) => {
            table.getColumn('name')?.setFilterValue(value)
          }}
        />
      </div>

      {/* <div className="rounded-md border"> */}
      <div className="border-t-NONE border-b">
        <Table>
          {/* <TableHeader> */}
          <TableHeader className="bg-gray-100/60 hover:bg-gray-100/60 dark:bg-gray-900/80 hover:dark:bg-gray-900/80 sticky">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={clsx([''], {
                        'pl-4 md:pl-6': index === 0,
                        'md:w-[35%]': index === 0 || index === 1,
                        'md:w-[20%]': index === 2,
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
            {isLoading ? (
              <>
                {Array.from({ length: pageSize }).map((_) => (
                  <TableRow className="h-16 w-full bg-red-400X hover:bg-transparent">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <TableCell
                        key={index}
                        className={clsx(['py-2 md:py-3'], {
                          'md:w-[35%]': index === 0 || index === 1,
                          'md:w-[20%]': index === 2,
                          'md:w-36 2xl:w-56 bg-red-300X': index === 3,
                        })}
                      >
                        <Skeleton
                          className={clsx(['w-full h-6'], {
                            // 'w-36': index === 1,
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
                  table.getRowModel().rows.map((row, _) => (
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

      <div className="px-3 md:px-5 py-3">
        <TableFooter
          pagination={{
            toStart: {
              onClick: () => table.setPageIndex(0),
              disabled:
                !table.getCanPreviousPage() ||
                table.getState().pagination.pageIndex + 1 >
                  Math.ceil(table.getFilteredRowModel().rows.length / pageSize),
            },
            toEnd: {
              onClick: () => table.setPageIndex(table.getPageCount() - 1),
              disabled:
                !table.getCanNextPage() ||
                table.getState().pagination.pageIndex + 1 >=
                  Math.ceil(table.getFilteredRowModel().rows.length / pageSize),
            },
            prev: {
              onClick: () => table.previousPage(),
              disabled:
                !table.getCanPreviousPage() ||
                table.getState().pagination.pageIndex + 1 >
                  Math.ceil(table.getFilteredRowModel().rows.length / pageSize),
            },
            next: {
              onClick: () => table.nextPage(),
              disabled:
                !table.getCanNextPage() ||
                table.getState().pagination.pageIndex + 1 >=
                  Math.ceil(table.getFilteredRowModel().rows.length / pageSize),
            },
          }}
          page={{
            hidden: isLoading || table.getFilteredRowModel().rows.length <= 5,
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          }}
          pageSize={{
            value: pageSize,
            disabled: isLoading || table.getFilteredRowModel().rows.length <= 5,
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
    </div>
  )
}

export default UserAccessTeamTable
