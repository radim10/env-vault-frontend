import { Button } from '@/components/ui/button'
import { Metadata, ResolvingMetadata } from 'next'

export function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Metadata {
  // read route params
  const projectName = params.projectName
  const env = params?.env

  return {
    title: `${projectName} / ${env}`,
  }
}

export default function EnvPage({
  params,
}: {
  params: { workspace: string; projectName: string; env: string }
}) {
  return <div>PAGE</div>
}
