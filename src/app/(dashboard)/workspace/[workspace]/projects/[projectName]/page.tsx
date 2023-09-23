import ProjectRoot from '@/components/projects/ProjectRoot'
import { Metadata, ResolvingMetadata } from 'next'

// TODO: load project SSR?
//

export function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Metadata {
  // read route params
  const projectName = params.projectName

  return {
    title: projectName,
  }
}
//
export default function ProjectPage({
  params,
}: {
  params: { workspace: string; projectName: string }
}) {
  return (
    <>
      <ProjectRoot workspaceId={params.workspace} projectName={params.projectName} />
    </>
  )
}
