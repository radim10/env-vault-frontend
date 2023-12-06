import ProjectAccess from '@/components/projectAccess/ProjectAccess'
import EnvironmentList from '@/components/projects/EnvironmentList'
import ProjectSettings from '@/components/projects/ProjectSettings'
import { validateServerSession } from '@/utils/auth/session'
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
export default async function ProjectPage({
  params,
}: {
  params: { workspace: string; projectName: string; projectTab: string }
}) {
  await validateServerSession('/login')

  if (
    params.projectTab !== 'environments' &&
    params.projectTab !== 'access' &&
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

      {params?.projectTab === 'access' && (
        <ProjectAccess workspaceId={params.workspace} projectName={params.projectName} />
      )}

      {params?.projectTab === 'settings' && (
        <div className="mt-4 px-6 lg:px-10">
          <ProjectSettings workspaceId={params.workspace} projectName={params.projectName} />
        </div>
      )}
    </>
  )
}
