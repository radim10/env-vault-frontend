'use client'

import { useGetWorkspaceUsers } from '@/api/queries/users'
import { columns } from './table/Columns'
import UsersDataTable from './table/DataTable'
import TableToolbar from './TableToolbar'
import { useQueryClient } from '@tanstack/react-query'
import InviteUserDialog from './InviteUserDialog'
import { useState } from 'react'

interface Props {
  workspaceId: string
}

const WorkspaceUsers: React.FC<Props> = ({ workspaceId }) => {
  const queryClient = useQueryClient()
  const [inviteUserDialog, setInviteUserDialog] = useState(false)

  // const { data } = useGetWorkspaceUsers(workspaceId)

  // const dummyData: WorkspaceUser[] = [
  //   {
  //     id: '915b7fa0-f194-47cb-8b47-479a4d88f0b4',
  //     name: 'radim',
  //     avatarUrl: 'https://avatars.githubusercontent.com/u/62602887?v=4',
  //     role: WorkspaceUserRole.ADMIN,
  //   },
  //   {
  //     id: '8afba311-8706-472d-836b-5d62a1eb8e32',
  //     name: 'John Doe John Doe John Doe John Doe dasdsadasd',
  //     avatarUrl: null,
  //     role: WorkspaceUserRole.MEMBER,
  //
  //   },
  // ]
  //

  return (
    <div>
      <InviteUserDialog
        queryClient={queryClient}
        workspaceId={workspaceId}
        opened={inviteUserDialog}
        onClose={() => setInviteUserDialog(false)}
        onEmailInvite={() => { }}
      />
      {/* <UsersDataTable columns={columns as any} data={dummyData} /> */}
      {/* <TableToolbar userCount={data?.totalCount ?? 0} /> */}
      <UsersDataTable
        onInviteUser={() => setInviteUserDialog(true)}
        columns={columns as any}
        workspaceId={workspaceId}
        queryClient={queryClient}
      />
    </div>
  )
}

export default WorkspaceUsers
