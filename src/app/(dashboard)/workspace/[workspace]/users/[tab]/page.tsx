import WorkspaceInvitations from '@/components/users/WorkspaceInvitations';
import WorkspaceUsers from '@/components/users/WorkspaceUsers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users',
}

export default function UsersPage({
  params,
  searchParams: _,
}: {
  params: { workspace: string; tab: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <>
    {params.tab === 'workspace' && <WorkspaceUsers workspaceId={params.workspace} />}
    {params.tab === 'invitations' && <WorkspaceInvitations workspaceId={params.workspace} />}

  </>
}
