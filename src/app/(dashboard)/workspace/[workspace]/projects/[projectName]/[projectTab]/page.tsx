import EnvironmentList from '@/components/projects/EnvironmentList'
import { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'

// TODO: load project SSR?
//

export function generateMetadata({ params }: any, parent: ResolvingMetadata): Metadata {
  // read route params
  const projectName = params.projectName
  const projectTab = params.projectTab

  return {
    title: `${projectName} / ${projectTab}`,
  }
}
//
export default function ProjectPage({
  params,
}: {
  params: { workspace: string; projectName: string; projectTab: string }
}) {
  if (
    params.projectTab !== 'environments' &&
    params.projectTab !== 'users' &&
    params.projectTab !== 'webhooks' &&
    params.projectTab !== 'settings'
  ) {
    redirect(`/workspace/${params.workspace}/projects/${params.projectName}/environments`)
  }
  return (
    <>
      {params?.projectTab === 'environments' && (
        <EnvironmentList workspaceId={params.workspace} projectName={params.projectName} />
      )}
    </>
  )
}
