'use client'

import { useGetUserAccessProjects } from '@/api/queries/users'
import UserAccessTable from './access/table/UserAccessTable'
import { userAccessProjectColumns } from './access/table/AccessTableColumns'
import UserAccessTeamTable from './access/teamsTable/UserAccessTeamTable'
import { userAccessTeamProjectColumns } from './access/teamsTable/TeamAccessTableColumns'

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
    <div className="flex flex-col gap-6 md:gap-8">
      <UserAccessTable
        userId={userId}
        workspaceId={workspaceId}
        columns={userAccessProjectColumns}
      />

      <UserAccessTeamTable
        userId={userId}
        workspaceId={workspaceId}
        columns={userAccessTeamProjectColumns}
      />
    </div>
  )
}

export default UserAccess
