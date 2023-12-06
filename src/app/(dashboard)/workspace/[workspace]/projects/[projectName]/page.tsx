import { validateServerSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

export default async function ProjectPage({
  params,
}: {
  params: { workspace: string; projectName: string }
}) {
  await validateServerSession('/login')
  redirect(`/workspace/${params.workspace}/projects/${params.projectName}/environments`)

  return (
    <>
      {/* <ProjectEnvironmentList workspaceId={params.workspace} projectName={params.projectName} /> */}
    </>
  )
}
