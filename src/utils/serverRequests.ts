import { UserSession } from '@/types/session'

const getUrl = (url: string) => {
  const apiUrl = process.env.API_URL

  return `${apiUrl}${url}`
}

// TODO: check session expiration -> refresh
export const getDefaultWorkspace = async (accessToken: string) => {
  const url = getUrl('/me/default-workspace')

  const res = await fetch(url, {
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

export const getInvitation = async (id: string) => {
  const url = getUrl(`/invitations/${id}`)

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = await res.json()
  return body as { workspace: string; role: WorkspaceUserRole }
}

export const handleGithubAuth = async (args: {
  code: string
  metadata?: any
  invitation?: string
}) => {
  const { code, invitation, metadata } = args

  const payload = {
    code,
    invitation,
    metadata,
  }

  const url = getUrl('/auth/github')

  const res = await fetch(url, {
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

export const handleGoogleAuth = async (args: {
  code: string
  metadata?: any
  invitation?: string
}) => {
  const { code, invitation, metadata } = args

  const payload = {
    code,
    invitation,
    metadata,
  }

  const url = getUrl('/auth/google')

  const res = await fetch(url, {
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
