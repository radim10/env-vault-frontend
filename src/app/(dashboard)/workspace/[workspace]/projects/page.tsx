import { Metadata } from 'next'
import Projects from '@/components/projects/Projects'

export const metadata: Metadata = {
  title: 'Projects',
}

export default function Home({ params }: { params: { workspace: string } }) {
  return (
    <>
      <Projects workspaceId={params?.workspace} />
    </>
  )
}
