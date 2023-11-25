import { UserSession } from '@/types/session'
import { validateServerSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

// TODO: check session -> refresh
const getDefaultWorkspace = async (session?: UserSession) => {
  const res = await fetch(`http://localhost:8080/api/v1/me/default-workspace`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = (await res.json()) as { id: string | null }

  return body
}

const WorkspacePage = async () => {
  await validateServerSession('/login')

  const workspaceData = await getDefaultWorkspace()

  if (!workspaceData?.id) {
    redirect('/welcome')
  } else {
    redirect(`/workspace/${workspaceData?.id}/projects`)
  }

  // redirect(`/workspace/4ef8a291-024e-4ed8-924b-1cc90d01315e/projects`)
}

export default WorkspacePage
