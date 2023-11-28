import { UserSession } from '@/types/session'
import { CookieAuth } from '@/components/CookieAuth'
import OauthError from '@/components/OAuthError'
import { getOsAndBrowser } from '@/utils/getOsBrowser'
import { headers } from 'next/headers'

async function handleGithubAuth(args: { code: string; metadata?: any; invitation?: string }) {
  const { code, invitation, metadata } = args

  const payload = {
    code,
    invitation,
    metadata,
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
  // metadata
  const ipHeader = headers().get('x-forwarded-for')
  const ip = ipHeader?.startsWith('::ffff:') ? ipHeader.slice(7) : ipHeader

  const userAgent = headers().get('user-agent')
  const { os, browser } = getOsAndBrowser(userAgent ?? '')
  //
  //
  const invitationId = extractUUIDv4(state) ?? undefined
  console.log('INVITATION ID: ', invitationId)

  const res = await handleGithubAuth({
    code,
    invitation: invitationId,
    metadata: { ip, os, browser },
  })

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
