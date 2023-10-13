import { EnvSettings } from '@/components/environments/Settings/EnvSettings'
import Access from '@/components/environments/access/Access'
import Changelog from '@/components/environments/changelog/ChangelogList'
import { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'

export function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Metadata {
  // read route params
  const { projectName, env, tab } = params

  return {
    title: `${projectName} / ${env} / ${tab}`,
    // title: `${projectName} / ${env}`,
  }
}

export default function EnvTabePage({
  params,
}: {
  params: { workspace: string; projectName: string; env: string; tab: string }
}) {
  if (
    params.tab !== 'tokens' &&
    params.tab !== 'changelog' &&
    params.tab !== 'settings' &&
    params.tab !== 'users'
  ) {
    redirect(`/workspace/${params.workspace}/projects/${params.projectName}/env/${params.env}`)
  }

  return (
    <div className="mt-5">
      {params.tab === 'tokens' && (
        <Access
          workspaceId={params.workspace}
          projectName={params.projectName}
          envName={params.env}
        />
      )}
      {params.tab === 'settings' && <EnvSettings />}
      {params.tab === 'changelog' && (
        <Changelog
          workspaceId={params.workspace}
          projectName={params.projectName}
          envName={params.env}
        />
      )}
    </div>
  )
}
