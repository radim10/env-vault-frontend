'use client'

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
import { useGetProjectAccessUsers } from '@/api/queries/projectAccess'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import TableToolbar from '@/components/users/TableToolbar'
import { ProjectAccessUser, ProjectRole } from '@/types/projectAccess'
import AddUsersAccessDrawer from '../AddUsersAccessDrawer'
import DeleteProjectUserAccessDialog from '../DeleteUserAccessDialog'
import UpdateUserAccessRoleDialog from '../UpdateUserAccessRoleDialog'

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

  const getCurrentKey = () => ['workspace', workspaceId, 'project', projectName, 'access', 'users']

  const [deleteUsersDialog, setDeleteUsersDialog] = useState<Array<{
    id: string
    name: string
  }> | null>(null)

  const handleGotoUser = (teamId: string) => {
    router.push(`/workspace/${workspaceId}/user/${teamId}/profile`)
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

  const handleDeleteUserAccess = (args: { id: string; name: string }[]) =>
    setDeleteUsersDialog(args)

  const [addUsersDrawerOpened, setAddUsersDrawerOpened] = useState(false)

  const closeDeleteDialog = () => {
    if (!deleteUsersDialog) return

    setDeleteUsersDialog({ ...deleteUsersDialog?.map((user) => ({ ...user, id: '' })) })
    setTimeout(() => {
      setDeleteUsersDialog(null)
    }, 150)
  }

  const handleDeletedUsers = (users: Array<{ id: string; name: string }>) => {
    const key = getCurrentKey()

    const currentTeams = queryClient.getQueryData<ListTeam[]>(key)

    if (currentTeams) {
      const updatedTeams = [...currentTeams].filter(
        (team) => !users.some((user) => user.id === team.id)
      )
      queryClient.setQueryData(key, updatedTeams)
    }

    toast({
      title: 'User(s) has been removed',
      description: 'Users have no user access anymore',
      variant: 'success',
    })
  }

  const handleAddedUsers = (newUsers: ProjectAccessUser[]) => {
    const key = getCurrentKey()

    const currentUsers = queryClient.getQueryData<ProjectAccessUser[]>(key)

    // TODO: sorting etc..
    if (currentUsers) {
      const updatedUsers = [...currentUsers, ...newUsers]
      queryClient.setQueryData(key, updatedUsers)
    }

    setAddUsersDrawerOpened(false)

    toast({
      title: 'Team(s) has been added',
      variant: 'success',
    })
  }

  const [updateUserRoleDialog, setUpdateUserRoleDialog] = useState<{
    id: string
    name: string
    role: ProjectRole
  } | null>(null)

  const handleChangeRole = (args: { id: string; name: string; role: ProjectRole }) =>
    setUpdateUserRoleDialog(args)

  const closeUpdateRoleDialog = () => {
    if (!updateUserRoleDialog) return

    setUpdateUserRoleDialog({ ...updateUserRoleDialog, id: '' })
    setTimeout(() => {
      setUpdateUserRoleDialog(null)
    }, 150)
  }

  const handleUpdatedUserRole = (user: { id: string; role: ProjectRole }) => {
    const key = getCurrentKey()
    const currentUsers = queryClient.getQueryData<ProjectAccessUser[]>(key)

    if (!currentUsers) return
    const userIndex = currentUsers.findIndex((u) => u.id === user.id)

    if (userIndex === -1) return
    const updatedUsers = produce([...currentUsers], (draftData) => {
      draftData[userIndex].role = user.role
    })

    console.log('updatedUsers', updatedUsers)

    queryClient.setQueryData(key, updatedUsers)

    toast({
      title: 'User role has been updated',
      variant: 'success',
    })
  }

  const table = useReactTable({
    pageCount: data ? Math.ceil(data?.length / pageSize) : undefined,
    data: data ?? defaultData,
    columns,
    meta: {
      goto: handleGotoUser,
      delete: handleDeleteUserAccess,
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
      <AddUsersAccessDrawer
        workspaceId={workspaceId}
        projectName={projectName}
        opened={addUsersDrawerOpened}
        onClose={() => setAddUsersDrawerOpened(false)}
        onAdded={handleAddedUsers}
      />

      {updateUserRoleDialog !== null && (
        <UpdateUserAccessRoleDialog
          user={updateUserRoleDialog}
          workspaceId={workspaceId}
          projectName={projectName}
          opened={updateUserRoleDialog?.id !== ''}
          onClose={() => closeUpdateRoleDialog()}
          onSuccess={(newRole) => {
            handleUpdatedUserRole({ id: updateUserRoleDialog.id, role: newRole })
            closeUpdateRoleDialog()
          }}
        />
      )}

      {deleteUsersDialog !== null && (
        <DeleteProjectUserAccessDialog
          users={deleteUsersDialog}
          workspaceId={workspaceId}
          projectName={projectName}
          opened={deleteUsersDialog?.[0]?.id !== ''}
          onClose={() => setDeleteUsersDialog(null)}
          onSuccess={() => {
            handleDeletedUsers(deleteUsersDialog)
            closeDeleteDialog()
          }}
        />
      )}

      <TableToolbar
        count={table.getRowModel().rows.length ?? null}
        loading={isLoading}
        onInviteUser={() => setAddUsersDrawerOpened(true)}
        submitText="Add users"
        entity="users"
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

                        // NOTE: with checkbox column
                        // 'bg-red-500X  w-8': index === 0,
                        // 'md:w-[35%]': index === 2 || index === 1,
                        // 'md:w-36 2xl:w-56 bg-red-300X': index === 3,

                        'md:w-[35%]': index === 0 || index === 1,
                        'md:w-36 2xl:w-56 bg-red-300X': index === 2,
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
                          'pr-0': index === 0,
                        })}
                      >
                        {index === 0 && (
                          <div className="flex items-center gap-5 w-full">
                            <Skeleton
                              className={clsx(['w-full'], {
                                'w-10 h-10 rounded-full': true,
                              })}
                            />
                            <Skeleton className="w-[85%] h-6" />
                          </div>
                        )}
                        {index !== 0 && <Skeleton className={'w-full h-6'} />}
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
