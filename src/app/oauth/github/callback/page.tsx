import { CookieAuth } from '@/components/CookieAuth'
import OauthError from '@/components/OAuthError'
import { getOsAndBrowser } from '@/utils/getOsBrowser'
import { headers } from 'next/headers'
import { redirectIfServerSession } from '@/utils/auth/session'
import { handleGithubAuth } from '@/utils/serverRequests'
import { extractUUIDv4 } from '@/utils/uuid'

export default async function Page({
  searchParams: { code, state },
}: {
  searchParams: { code: string; state: string }
}) {
  await redirectIfServerSession()

  // metadata
  const ipHeader = headers().get('x-forwarded-for')
  const ip = ipHeader?.startsWith('::ffff:') ? ipHeader.slice(7) : ipHeader

  const userAgent = headers().get('user-agent')
  const { os, browser } = getOsAndBrowser(userAgent ?? '')

  const invitationId = extractUUIDv4(state) ?? undefined

  const res = await handleGithubAuth({
    code,
    invitation: invitationId,
    metadata: { ip, os, browser },
  })

  if (!res) {
    return <OauthError />
  }

  const workspaceId = res?.workspaceId

  if (workspaceId === undefined) {
    return <OauthError />
  }

  const session = res?.session

  return <CookieAuth data={session} workspaceId={workspaceId} />
}
