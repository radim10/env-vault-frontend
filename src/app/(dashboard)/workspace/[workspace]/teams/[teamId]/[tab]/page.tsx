import TeamMembers from '@/components/teams/TeamMembers'
import TeamSettings from '@/components/teams/TeamSettings'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team',
}

export default function TeamPage({
  params,
  searchParams: _,
}: {
  params: { workspace: string; teamId: string; tab: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <>
      {params.tab === 'members' && (
        <TeamMembers workspaceId={params.workspace} teamId={params.teamId} />
      )}
      {params.tab === 'settings' && <TeamSettings />}
    </>
  )
}
