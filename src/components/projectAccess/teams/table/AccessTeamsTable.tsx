'use client'

import { useMemo, useState } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { ListTeam } from '@/types/teams'
import { useRouter } from 'next/navigation'
import TableFooter from '@/components/tables/TableFooter'
import TeamsToolbar from '@/components/teams/table/Toolbar'
import { useGetProjectAccessTeams } from '@/api/queries/projectAccess'
import AddTeamAccessDrawer from '../AddTeamAccessDrawer'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'

interface DataTableProps {
  workspaceId: string
  projectName: string
  columns: ColumnDef<ListTeam>[]
}

function AccessTeamsTable({ columns, projectName, workspaceId }: DataTableProps) {
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

  const { data, isLoading, error } = useGetProjectAccessTeams({
    workspaceId,
    projectName,
  })

  const getCurrentKey = () => ['workspace', workspaceId, 'project', projectName, 'access', 'teams']

  const handleGoToTeam = (teamId: string) => {
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

  const handleAddedTeams = (newTeams: ListTeam[]) => {
    const key = getCurrentKey()

    const currentTeams = queryClient.getQueryData<ListTeam[]>(key)

    if (currentTeams) {
      const sortBy = sorting?.[0]?.id
      const descSort = sorting?.[0]?.desc

      // TODO: fix
      const updatedTeams = produce(currentTeams, (draftData) => {
        draftData = [...draftData, ...newTeams]
        draftData = sortTeams(draftData, sortBy as 'membersCount' | 'name', descSort)
      })

      queryClient.setQueryData(key, updatedTeams)
    }

    //
    setAddTeamDrawerOpened(false)

    toast({
      title: 'Team(s) has been added',
      variant: 'success',
    })
  }

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.length / pageSize) : undefined,
    data: data ?? defaultData,
    columns,
    meta: {
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
    enableSorting: !isLoading,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  })

  const [addTeamDrawerOpened, setAddTeamDrawerOpened] = useState(false)

  return (
    <div>
      <AddTeamAccessDrawer
        workspaceId={workspaceId}
        projectName={projectName}
        opened={addTeamDrawerOpened}
        onClose={() => setAddTeamDrawerOpened(false)}
        onAdded={handleAddedTeams}
      />

      <TeamsToolbar
        count={table.getRowModel().rows.length ?? null}
        loading={isLoading}
        onNewTeam={() => setAddTeamDrawerOpened(true)}
        submitText="Add team"
        isSearchCount={(table.getColumn('name')?.getFilterValue() as string)?.length > 0}
        search={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onSearch={(value) => {
          table.getColumn('name')?.setFilterValue(value)
        }}
      />
      {/**/}
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
  )
}

export default AccessTeamsTable
