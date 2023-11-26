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
  let body = (await res.json()) as { session: UserSession; workspaceId?: string }
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

const uuidRegex =
  /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}/

function extractUUIDv4(inputString: string) {
  const match = inputString.match(uuidRegex)

  return match ? match[0] : null
}

export default async function Page({
  searchParams: { code, state },
}: {
  searchParams: { code: string; state: string }
}) {
  const invitationId = extractUUIDv4(state) ?? undefined
  console.log('INVITATION ID: ', invitationId)
  const res = await handleGoogleAuth(code, invitationId)

  if (!res) {
    return <>Something went wrong</>
  }

  const workspaceData = res?.workspaceId
    ? { id: res.workspaceId }
    : await getDefaultWorkspace(res?.session?.accessToken)

  if (workspaceData === undefined) {
    return <>Something went wrong</>
  }

  const session = res?.session

  return <CookieAuth data={session} workspaceId={workspaceData?.id} />
}
