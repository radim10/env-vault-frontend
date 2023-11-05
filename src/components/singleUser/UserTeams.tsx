'use client'

import { useGetUserTeams } from '@/api/queries/users'

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

  return (
    <div>
      {teams?.map((team) => (
        <div>{team.name}</div>
      ))}
    </div>
  )
}

export default UserTeams
