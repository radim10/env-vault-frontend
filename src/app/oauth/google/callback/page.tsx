import { CookieAuth } from '@/components/CookieAuth'
import { UserSession } from '@/types/session'
import { WorkspaceUserRole } from '@/types/users'

// import { Session } from '@/types/auth'
//
async function handleGoogleAuth(code: string, invitation?: string) {
  // const res = await fetch(`${process.env.API_URL}/auth/github`, {
  const payload = {
    code,
    invitation,
  }

  const res = await fetch(`http://localhost:8080/api/v1/auth/google`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = res.json()
  return body
}

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

async function getInvitationWorkspaceId(id: string) {
  const res = await fetch(`http://localhost:8080/api/v1/invitations/${id}/workspace`, {
    method: 'GET',
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = (await res.json()) as { workspace: string; role: WorkspaceUserRole }

  return { id: body.workspace }
}

// state = invitaation
// TODO: verify that is is uuid (regex??)
export default async function Page({
  searchParams: { code, state },
}: {
  searchParams: { code: string; state?: string }
}) {
  // let invitationId!: string | undefined
  // let workspaceId!: string | undefined | null
  //
  // if (state) {
  //   const workspaceData = await getInvitation(state)
  //
  //   if (workspaceData) {
  //     invitationId = state
  //     workspaceId = workspaceData.id
  //   }
  // }
  //
  // console.log('Code: ', code)
  // const res = (await handleGoogleAuth(code, state)) as UserSession
  //
  // if (!workspaceId) {
  //   const workspaceData = await getDefaultWorkspace(res?.accessToken)
  //   if (workspaceData) workspaceId = workspaceData.id
  // }
  //
  // if (workspaceId === undefined) {
  //   return <>Something went wrong</>
  // }
  //
  const res = (await handleGoogleAuth(code, state)) as UserSession & { workspaceId?: string }

  const workspaceData = res?.workspaceId
    ? { id: res.workspaceId }
    : await getDefaultWorkspace(res?.accessToken)

  if (workspaceData === undefined) {
    return <>Something went wrong</>
  }

  const session = { ...res, workspaceId: undefined }

  return <CookieAuth data={session} workspaceId={workspaceData?.id} />
}
