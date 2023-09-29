import Access from '@/components/environments/access/Access'
import { redirect } from 'next/navigation'

export default function EnvTabePage({
  params,
}: {
  params: { workspace: string; projectName: string; env: string; tab: string }
}) {
  if (params.tab !== 'tokens' && params.tab !== 'changelog' && params.tab !== 'settings' && params.tab !== 'users') {
    redirect(`/workspace/${params.workspace}/projects/${params.projectName}/env/${params.env}`)
  }

  return (
    <div>
      {params.tab === 'tokens' && (
        <Access
          workspaceId={params.workspace}
          projectName={params.projectName}
          envName={params.env}
        />
      )}
    </div>
  )
}
