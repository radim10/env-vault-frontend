import WorkspaceSettings from '@/components/settings/WorkspaceSettings'
import { Metadata, ResolvingMetadata } from 'next'

export function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Metadata {
  const tab = params.tab

  return {
    title: `Settings / ${tab}`,
  }
}

export default function Settings({
  params: { workspace, tab },
}: {
  params: { workspace: string; tab: string }
}) {
  return <>{tab === 'workspace' && <WorkspaceSettings workspaceId={workspace} />}</>
}
