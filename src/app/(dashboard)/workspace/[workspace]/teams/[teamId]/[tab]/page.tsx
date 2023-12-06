import TeamAccess from '@/components/teams/TeamAccess'
import TeamMembers from '@/components/teams/TeamMembers'
import TeamSettings from '@/components/teams/TeamSettings'
import { Metadata } from 'next'
import { validateServerSession } from '@/utils/auth/session'

export const metadata: Metadata = {
  title: 'Team',
}

export default async function TeamPage({
  params,
  searchParams: _,
}: {
  params: { workspace: string; teamId: string; tab: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  await validateServerSession('/login')

  return (
    <>
      {params.tab === 'members' && (
        <TeamMembers workspaceId={params.workspace} teamId={params.teamId} />
      )}
      {params.tab === 'settings' && <TeamSettings />}
      {params.tab === 'access' && (
        <TeamAccess workspaceId={params.workspace} teamId={params.teamId} />
      )}
    </>
  )
}
