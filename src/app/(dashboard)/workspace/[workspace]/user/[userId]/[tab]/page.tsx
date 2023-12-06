import UserAccess from '@/components/singleUser/UserAccess'
import UserProfile from '@/components/singleUser/UserProfile'
import UserTeams from '@/components/singleUser/UserTeams'
import { validateServerSession } from '@/utils/auth/session'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User details',
}

const UserPage = async ({
  params: { workspace, userId, tab },
}: {
  params: { workspace: string; userId: string; tab: string }
}) => {
  await validateServerSession('/login')

  return (
    <>
      {tab === 'teams' && <UserTeams workspaceId={workspace} userId={userId} />}
      {tab === 'profile' && <UserProfile workspaceId={workspace} userId={userId} />}
      {tab === 'access' && <UserAccess workspaceId={workspace} userId={userId} />}
    </>
  )
}

export default UserPage
