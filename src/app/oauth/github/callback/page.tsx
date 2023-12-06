import { CookieAuth } from '@/components/CookieAuth'
import OauthError from '@/components/OAuthError'
import { getOsAndBrowser } from '@/utils/getOsBrowser'
import { headers } from 'next/headers'
import { redirectIfServerSession } from '@/utils/auth/session'
import { getDefaultWorkspace, handleGithubAuth } from '@/utils/serverRequests'
import { extractUUIDv4 } from '@/utils/uuid'
import { saveSession } from '@/app/actions'

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

  const workspaceData = res?.workspaceId
    ? { id: res.workspaceId }
    : await getDefaultWorkspace(res?.session?.accessToken)

  if (workspaceData === undefined) {
    return <OauthError />
  }

  const session = res?.session
  await saveSession(session)

  return <CookieAuth data={session} workspaceId={workspaceData?.id} />
}
