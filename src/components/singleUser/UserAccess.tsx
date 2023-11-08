'use client'

import { useGetUserAccessProjects } from '@/api/queries/users'
import UserAccessTable from './access/table/UserAccessTable'
import { userAccessProjectColumns } from './access/table/AccessTableColumns'

interface Props {
  workspaceId: string
  userId: string
}

const UserAccess: React.FC<Props> = ({ workspaceId, userId }) => {
  // const { data } = useGetUserAccessProjects({
  //   workspaceId,
  //   userId,
  // })

  return (
    <div>
      <UserAccessTable
        userId={userId}
        workspaceId={workspaceId}
        columns={userAccessProjectColumns}
      />
    </div>
  )
}

export default UserAccess
