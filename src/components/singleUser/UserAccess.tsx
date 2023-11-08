'use client'

import { useGetUserAccessProjects } from '@/api/queries/users'

interface Props {
  workspaceId: string
  userId: string
}

const UserAccess: React.FC<Props> = ({ workspaceId, userId }) => {
  const { data } = useGetUserAccessProjects({
    workspaceId,
    userId,
  })

  return <div>{data?.length}</div>
}

export default UserAccess
