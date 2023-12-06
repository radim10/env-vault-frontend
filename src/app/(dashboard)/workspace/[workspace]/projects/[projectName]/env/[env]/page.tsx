import SecretsRoot from '@/components/secrects/SecretsRoot'
import { validateServerSession } from '@/utils/auth/session'
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
export default async function EnvPage({
  params,
}: {
  params: { workspace: string; projectName: string; env: string }
}) {
  await validateServerSession('/login')

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
