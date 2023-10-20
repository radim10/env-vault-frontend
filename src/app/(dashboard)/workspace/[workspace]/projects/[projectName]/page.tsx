import { redirect } from 'next/navigation'

export default function ProjectPage({
  params,
}: {
  params: { workspace: string; projectName: string }
}) {
  redirect(`/workspace/${params.workspace}/projects/${params.projectName}/environments`)

  return (
    <>
      {/* <ProjectEnvironmentList workspaceId={params.workspace} projectName={params.projectName} /> */}
    </>
  )
}
