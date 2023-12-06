import WorkspaceTeams from '@/components/teams/WorkspaceTeams'
import WorkspaceInvitations from '@/components/users/WorkspaceInvitations'
import WorkspaceUsers from '@/components/users/WorkspaceUsers'
import { validateServerSession } from '@/utils/auth/session'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users',
}

export default async function UsersPage({
  params,
  searchParams: _,
}: {
  params: { workspace: string; tab: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  await validateServerSession('/login')

  return (
    <>
      {params.tab === 'workspace' && <WorkspaceUsers workspaceId={params.workspace} />}
      {params.tab === 'invitations' && <WorkspaceInvitations workspaceId={params.workspace} />}
      {params.tab === 'teams' && <WorkspaceTeams workspaceId={params.workspace} />}
    </>
  )
}
