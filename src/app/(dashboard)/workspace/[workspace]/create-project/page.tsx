import CreateProject from '@/components/projects/CreateProject'
import { validateServerSession } from '@/utils/auth/session'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create project',
}

export default async function CreateProjectPage({ params }: { params: { workspace: string } }) {
  await validateServerSession('/login')
  return <CreateProject workspaceId={params?.workspace} />
}
