import { UserSession } from '@/types/session'
import { WorkspaceUserRole } from '@/types/users'

export const getUrl = (url: string) => {
  const apiUrl = process.env.API_URL

  return `${apiUrl}${url}`
}

// TODO: check session expiration -> refresh
export const getDefaultWorkspace = async (accessToken: string) => {
  const url = getUrl('/me/default-workspace')

  try {
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
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export const getInvitation = async (id: string) => {
  const url = getUrl(`/invitations/${id}`)

  try {
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    })

    console.log(res.status)
    if (!res.ok) return undefined
    let body = await res.json()
    return body as { workspace: string; role: WorkspaceUserRole }
  } catch (err) {
    console.log(err)
    return undefined
  }
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

  try {
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
    let body = (await res.json()) as { session: UserSession; workspaceId: string | null }
    return body
  } catch (err) {
    console.log(err)
    return undefined
  }
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

  try {
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
    let body = (await res.json()) as { session: UserSession; workspaceId: string | null }
    return body
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export const handleEmailConfirmation = async (token: string) => {
  const payload = {
    token,
  }

  const url = getUrl('/auth/email/confirm')

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const status = res.status
    console.log(status)

    if (status === 204) {
      return { ok: true }
    } else if (status === 400) {
      let body = (await res.json()) as {
        error: { code: 'invalid_token' | 'token_expired' | 'email_already_confirmed' }
      }

      return { ok: false, errorCode: body?.error?.code }
    } else return { ok: false }
  } catch (e) {
    return { ok: false }
  }
}
