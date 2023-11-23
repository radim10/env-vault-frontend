import { Metadata } from 'next'
import Projects from '@/components/projects/Projects'
import { validateServerSession } from '@/utils/auth/session'

export const metadata: Metadata = {
  title: 'Projects',
}

export default async function Home({ params }: { params: { workspace: string } }) {
  await validateServerSession('/login')
  return (
    <>
      <Projects workspaceId={params?.workspace} />
    </>
  )
}
