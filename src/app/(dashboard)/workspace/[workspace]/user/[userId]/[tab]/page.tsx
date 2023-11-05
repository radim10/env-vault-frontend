import UserProfile from '@/components/singleUser/UserProfile'
import UserTeams from '@/components/singleUser/UserTeams'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User details',
}

const UserPage = ({
  params: { workspace, userId, tab },
}: {
  params: { workspace: string; userId: string; tab: string }
}) => {
  return (
    <>
      {tab === 'teams' && <UserTeams workspaceId={workspace} userId={userId} />}
      {tab === 'profile' && <UserProfile workspaceId={workspace} userId={userId} />}
    </>
  )
}

export default UserPage
