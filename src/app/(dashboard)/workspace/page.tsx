import { UserSession } from '@/types/session'
import { validateServerSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

// TODO: check session -> refresh
const getDefaultWorkspace = async (accessToken: string) => {
  const res = await fetch(`http://localhost:8080/api/v1/me/default-workspace`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = (await res.json()) as { id: string | null }

  return body
}

// TODO: handle redirect + delete cookies if revoked access token
const WorkspacePage = async () => {
  const session = (await validateServerSession('/login')) as UserSession
  const workspaceData = await getDefaultWorkspace(session?.accessToken)

  console.log(workspaceData)

  if (!workspaceData?.id) {
    redirect('/welcome')
  } else {
    redirect(`/workspace/${workspaceData?.id}/projects`)
  }

  // redirect(`/workspace/4ef8a291-024e-4ed8-924b-1cc90d01315e/projects`)
}

export default WorkspacePage
