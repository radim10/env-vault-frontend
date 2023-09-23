import { redirect } from 'next/navigation'

export default function EnvTabePage({
  params,
}: {
  params: { workspace: string; projectName: string; env: string; tab: string }
}) {
  if (params.tab !== 'access' && params.tab !== 'changelog') {
    redirect(`/workspace/${params.workspace}/projects/${params.projectName}/env/${params.env}`)
  }
  return <div></div>
}
