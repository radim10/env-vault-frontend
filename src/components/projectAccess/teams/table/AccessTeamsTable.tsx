'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { produce } from 'immer'
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
import DeleteProjectTeamAccessDialog from '../DeleteTeamAccessDialog'
import { ProjectAccessTeam, ProjectRole } from '@/types/projectAccess'
import UpdateTeamAccessRoleDialog from '../UpdateTeamAccessRoleDialog'
import TypographyH4 from '@/components/typography/TypographyH4'
import { Icons } from '@/components/icons'
import TableError from '@/components/TableError'
import { projectAccessErrorMsgFromCode } from '@/api/requests/projectAccess'

interface DataTableProps {
  workspaceId: string
  projectName: string
  columns: ColumnDef<ProjectAccessTeam>[]
  readOnly: boolean
}

const AccessTeamsTable: React.FC<DataTableProps> = ({
  columns,
  projectName,
  workspaceId,
  readOnly,
}) => {
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

  const { data, isLoading, error, refetch } = useGetProjectAccessTeams({
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

  const handleAddedTeams = (newTeams: ProjectAccessTeam[]) => {
    const key = getCurrentKey()

    const currentTeams = queryClient.getQueryData<ProjectAccessTeam[]>(key)

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

  const handleChangeRole = (args: {
    id: string
    name: string
    membersCount: number
    role: ProjectRole
  }) => setUpdateTeamRoleDialog(args)

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.length / pageSize) : undefined,
    data: data ?? defaultData,
    columns,
    meta: {
      goto: handleGoToTeam,
      delete: handleDeleteTeamAccess,
      changeRole: handleChangeRole,
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

  const [updateTeamRoleDialog, setUpdateTeamRoleDialog] = useState<{
    id: string
    name: string
    membersCount: number
    role: ProjectRole
  } | null>(null)

  const closeUpdateRoleDialog = () => {
    if (!updateTeamRoleDialog) return

    setUpdateTeamRoleDialog({ ...updateTeamRoleDialog, id: '' })
    setTimeout(() => {
      setUpdateTeamRoleDialog(null)
    }, 150)
  }

  const handleUpdatedTeamRole = (user: { id: string; role: ProjectRole }) => {
    const key = getCurrentKey()
    const currentTeams = queryClient.getQueryData<ProjectAccessTeam[]>(key)

    if (!currentTeams) return
    const teamIndex = currentTeams.findIndex((u) => u.id === user.id)

    if (teamIndex === -1) return
    const updatedTeams = produce([...currentTeams], (draftData) => {
      draftData[teamIndex].role = user.role
    })

    console.log('updatedUsers', updatedTeams)

    queryClient.setQueryData(key, updatedTeams)

    toast({
      title: 'Team role has been updated',
      variant: 'success',
    })
  }

  if (error) {
    return (
      <TableError
        className="mt-16"
        description={projectAccessErrorMsgFromCode(error?.code) ?? 'Failed to project tems'}
        actionBtn={{
          text: 'Try again',
          className: 'px-6',
          onClick: () => refetch(),
        }}
      />
    )
  }

  return (
    <div className="rounded-md border">
      <div className="px-3 pt-3 md:px-5 md:pt-4">
        <div className="gap-3 flex items-center">
          <TypographyH4>Team access</TypographyH4>
          <Icons.users2 className="h-5 w-5 opacity-80" />
        </div>
      </div>

      <AddTeamAccessDrawer
        workspaceId={workspaceId}
        projectName={projectName}
        opened={addTeamDrawerOpened}
        onClose={() => setAddTeamDrawerOpened(false)}
        onAdded={handleAddedTeams}
      />

      {deleteTeamDialog !== null && (
        <DeleteProjectTeamAccessDialog
          workspaceId={workspaceId}
          projectName={projectName}
          team={deleteTeamDialog}
          opened={deleteTeamDialog?.id !== ''}
          onClose={() => closeDeleteDialog()}
          onSuccess={() => {
            handleDeletedTeam(deleteTeamDialog?.id)
            closeDeleteDialog()
          }}
        />
      )}

      {updateTeamRoleDialog !== null && (
        <UpdateTeamAccessRoleDialog
          team={updateTeamRoleDialog}
          workspaceId={workspaceId}
          projectName={projectName}
          opened={updateTeamRoleDialog?.id !== ''}
          onClose={() => closeUpdateRoleDialog()}
          onSuccess={(newRole) => {
            handleUpdatedTeamRole({ id: updateTeamRoleDialog.id, role: newRole })
            closeUpdateRoleDialog()
          }}
        />
      )}

      <div className="pl-3 md:pl-5 pr-1 md:pr-3">
        <TeamsToolbar
          count={table.getRowModel().rows.length ?? null}
          loading={isLoading}
          onNewTeam={!readOnly ? () => setAddTeamDrawerOpened(true) : undefined}
          submitText="Add team"
          isSearchCount={(table.getColumn('name')?.getFilterValue() as string)?.length > 0}
          search={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onSearch={(value) => {
            table.getColumn('name')?.setFilterValue(value)
          }}
        />
      </div>
      {/**/}
      {/* <div className="rounded-md border"> */}
      <div className="border-b">
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
                        // 'md:w-[45%]': index === 0 || index === 1,
                        'pl-4 md:pl-6': index === 0,
                        'w-[45%]': index === 0 || (index === 2 && !readOnly),
                        'w-[20%]': index === 1,
                        'w-fit': index === 2 && readOnly,
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
        className="px-3 md:px-5 py-3"
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
