import WorkspaceUsers from '@/components/users/WorkspaceUsers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users',
}

export default function UsersPage({ params }: { params: { workspace: string; tab: string } }) {
  return <>{params.tab === 'workspace' && <WorkspaceUsers workspaceId={params.workspace} />}</>
}
