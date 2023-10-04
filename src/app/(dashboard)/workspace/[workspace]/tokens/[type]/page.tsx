import AccessTable from '@/components/environments/access/AccessTable'
import CliTokens from '@/components/tokens/CliTokens'
import EnvTokens from '@/components/tokens/EnvTokens'
import WorkspaceTokens from '@/components/tokens/WorkspaceTokens'
import { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'

export function generateMetadata({ params }: any, parent: ResolvingMetadata): Metadata {
  // read route params
  const type = params.type

  return {
    title: `Tokens / ${type}`,
  }
}

export default function TokensPage({ params }: { params: { workspace: string; type: string } }) {
  if (
    params.type !== 'cli' &&
    params.type !== 'environments' &&
    params.type !== 'workspace' &&
    params.type !== 'admin'
  ) {
    redirect(`/workspace/${params.workspace}/tokens/cli`)
  }

  return (
    <>
      {params?.type === 'environments' && <EnvTokens workspaceId={params?.workspace} />}
      {params?.type === 'workspace' && <WorkspaceTokens workspaceId={params?.workspace} />}
      {params?.type === 'cli' && <CliTokens workspaceId={params?.workspace} />}
    </>
  )
}
