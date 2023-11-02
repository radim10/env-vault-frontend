import TeamSettings from '@/components/teams/TeamSettings'
import WorkspaceUsers from '@/components/users/WorkspaceUsers'
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
      {params.tab === 'members' && <WorkspaceUsers workspaceId={params.workspace} />}
      {params.tab === 'settings' && <TeamSettings />}
    </>
  )
}
