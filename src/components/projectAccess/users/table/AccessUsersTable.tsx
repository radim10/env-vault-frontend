'use client'

import clsx from 'clsx'
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
import { useGetProjectAccessUsers } from '@/api/queries/projectAccess'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import TableToolbar from '@/components/users/TableToolbar'
import { ProjectAccessUser } from '@/types/projectAccess'

interface DataTableProps {
  workspaceId: string
  projectName: string
  columns: ColumnDef<ProjectAccessUser>[]
}

const AccessUsersTable: React.FC<DataTableProps> = ({ columns, projectName, workspaceId }) => {
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

  const { data, isLoading, error } = useGetProjectAccessUsers({
    workspaceId,
    projectName,
  })

  const getCurrentKey = () => ['workspace', workspaceId, 'project', projectName, 'access', 'teams']

  const [deleteTeamDialog, setDeleteTeamDialog] = useState<{
    id: string
    name: string
  } | null>(null)

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
      // const updatedTeams = produce(currentTeams, (draftData) => {
      //   draftData = [...currentTeams, ...newTeams]
      //   console.log('draftData', draftData)
      //
      //   const sorted = sortTeams(draftData, sortBy as 'membersCount' | 'name', descSort)
      //   draftData = sorted
      //
      //   console.log('draftDataSorted', draftData)
      // })
      //
      // console.log('updatedTeams', updatedTeams)
      const updatedTeams = [...currentTeams, ...newTeams]
      const sortedUpdated = sortTeams(updatedTeams, sortBy as 'membersCount' | 'name', descSort)

      queryClient.setQueryData(key, sortedUpdated)
    }

    //
    setAddTeamDrawerOpened(false)

    toast({
      title: 'Team(s) has been added',
      variant: 'success',
    })
  }

  const handleDeleteTeamAccess = (args: { id: string; name: string }) => setDeleteTeamDialog(args)

  const handleShowProfile = (id: string) => {
    router.push(`/workspace/${workspaceId}/user/${id}/profile`)
  }

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.length / pageSize) : undefined,
    data: data ?? defaultData,
    columns,
    meta: {
      showProfile: handleShowProfile,
      delete: handleDeleteTeamAccess,
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

  const closeDeleteDialog = () => {
    if (!deleteTeamDialog) return

    setDeleteTeamDialog({ ...deleteTeamDialog, id: '' })
    setTimeout(() => {
      setDeleteTeamDialog(null)
    }, 150)
  }

  const handleDeletedTeam = (id: string) => {
    const key = getCurrentKey()

    const currentTeams = queryClient.getQueryData<ListTeam[]>(key)

    if (currentTeams) {
      const updatedTeams = [...currentTeams].filter((team) => team.id !== id)
      queryClient.setQueryData(key, updatedTeams)
    }

    toast({
      title: 'Team has been removed',
      description: 'Team members have no access anymore',
      variant: 'success',
    })
  }

  return (
    <div>
      {/* {deleteTeamDialog !== null && ( */}
      {/*   <DeleteProjectTeamAccessDialog */}
      {/*     workspaceId={workspaceId} */}
      {/*     projectName={projectName} */}
      {/*     team={deleteTeamDialog} */}
      {/*     opened={deleteTeamDialog?.id !== ''} */}
      {/*     onClose={() => closeDeleteDialog()} */}
      {/*     onSuccess={() => { */}
      {/*       handleDeletedTeam(deleteTeamDialog?.id) */}
      {/*       closeDeleteDialog() */}
      {/*     }} */}
      {/*   /> */}
      {/* )} */}

      <TableToolbar
        userCount={table.getRowModel().rows.length ?? null}
        loading={isLoading}
        onInviteUser={() => {}}
        submitText="Add users"
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
                        // 'md:w-[50%]': index === 1 || index === 2,
                        // 'pl-7 bg-red-400X': table.getRowModel().rows?.length === 0 && !isLoading,
                        //
                        'bg-red-500X  w-8': index === 0,
                        'md:w-[35%]': index === 2 || index === 1,
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

export default AccessUsersTable
