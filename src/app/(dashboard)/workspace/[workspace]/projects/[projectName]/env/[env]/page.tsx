import SecretsRoot from '@/components/secrects/SecretsRoot'
import { Metadata, ResolvingMetadata } from 'next'

export function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Metadata {
  // read route params
  const projectName = params.projectName
  const env = params?.env

  return {
    title: `${projectName} / ${env} / secrets`,
  }
}

// secrets page
export default function EnvPage({
  params,
}: {
  params: { workspace: string; projectName: string; env: string }
}) {
  return (
    <>
      <SecretsRoot
        workspaceId={params.workspace}
        projectName={params.projectName}
        envName={params.env}
      />
    </>
  )
}
