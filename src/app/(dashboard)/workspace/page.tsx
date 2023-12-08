import { UserSession } from '@/types/session'
import { validateServerSession } from '@/utils/auth/session'
import { getDefaultWorkspace } from '@/utils/serverRequests'
import { redirect } from 'next/navigation'

// TODO: handle redirect + delete cookies if revoked access token
// TODO: check session expiration -> refresh
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
