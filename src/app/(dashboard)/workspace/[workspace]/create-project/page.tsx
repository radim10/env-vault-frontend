import CreateProject from '@/components/projects/CreateProject'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create project',
}

export default function CreateProjectPage({ params }: { params: { workspace: string } }) {
  return <CreateProject workspaceId={params?.workspace} />
}
