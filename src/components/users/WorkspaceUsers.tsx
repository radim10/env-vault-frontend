'use client'

import { useGetWorkspaceUsers } from '@/api/queries/users'
import { columns } from './table/Columns'
import UsersDataTable from './table/DataTable'

interface Props {
  workspaceId: string
}

const WorkspaceUsers: React.FC<Props> = ({ workspaceId }) => {
  const { data } = useGetWorkspaceUsers(workspaceId)

  return (
    <div>
      <UsersDataTable columns={columns as any} data={data ?? []} />
    </div>
  )
}

export default WorkspaceUsers
