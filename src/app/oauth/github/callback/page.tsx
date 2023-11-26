import { UserSession } from '@/types/session'
import { CookieAuth } from '@/components/CookieAuth'
import OauthError from '@/components/OAuthError'

async function handleGithubAuth(code: string, invitation?: string) {
  const payload = {
    code,
    invitation,
  }

  const res = await fetch(`http://localhost:8080/api/v1/auth/github`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  console.log(res.status)
  console.log(res)
  if (!res.ok) return undefined
  let body = (await res.json()) as { session: UserSession; workspaceId?: string }
  return body
}

// TODO:
async function getDefaultWorkspace(accessToken: string) {
  const { data } = await new Promise((resolve) => setTimeout(resolve, 250)).then(() => ({
    data: { id: '4ef8a291-024e-4ed8-924b-1cc90d01315e' },
  }))

  return data
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

  const res = await handleGithubAuth(code, invitationId)

  if (!res) {
    return <OauthError />
  }

  const workspaceData = res?.workspaceId
    ? { id: res.workspaceId }
    : await getDefaultWorkspace(res?.session?.accessToken)

  if (workspaceData === undefined) {
    return <OauthError />
  }

  const session = res?.session

  return <CookieAuth data={session} workspaceId={workspaceData?.id} />
}
