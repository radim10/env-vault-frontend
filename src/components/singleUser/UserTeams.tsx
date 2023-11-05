'use client'

import { useGetUserTeams } from '@/api/queries/users'
import UserTeamsTable from './table/UserTeamsTable'
import { userTeamsColumns } from './table/UserTeamsColumns'
import { Icons } from '../icons'

interface Props {
  workspaceId: string
  userId: string
}

const UserTeams: React.FC<Props> = ({ workspaceId, userId }) => {
  const {
    data: teams,
    isLoading,
    error,
  } = useGetUserTeams({
    workspaceId,
    userId,
  })

  if (error) {
    return 'Error'
  }

  return (
    <div>
      {teams?.length !== 0 || isLoading ? (
        <UserTeamsTable
          workspaceId={workspaceId}
          columns={userTeamsColumns}
          data={teams ?? []}
          isLoading={isLoading}
        />
      ) : (
        <div className="rounded-md border h-80 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 h-full">
            <Icons.users2 className="w-12 h-12 opacity-40" />
            <div className="flex flex-col gap-0 items-center">
              <div className="text-lg font-medium">No team membership</div>
              <div className="text-[0.9rem] text-muted-foreground">
                User is not a member of any team
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTeams
