import { UserSession } from '@/types/session'
import { SubscriptionPlan } from '@/types/subscription'
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
    throw Error('error')
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
    return body as { workspace: string; role: WorkspaceUserRole; canJoin: boolean }
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export type OauthErrorCode = 'invalid_code' | 'unknown' | 'user_banned'

type GithubSignInResponse = {
  ok: boolean
  errorCode?: OauthErrorCode
  data?: {
    session: UserSession
    workspaceId: string | null
  }
}

export const handleGithubAuth = async (args: {
  code: string
  metadata?: any
  invitation?: string
}): Promise<GithubSignInResponse> => {
  const { code, invitation, metadata } = args

  const payload = {
    code,
    invitation,
    metadata,
  }

  const url = getUrl('/auth/github')

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    const { ok, status } = response
    console.log(ok, status)
    console.log(status)

    if (!ok) {
      if (status === 400) {
        const errorBody = await response.json().catch(() => ({}))
        console.log('Error Body:', errorBody)

        if (errorBody?.error?.code) {
          const errorCode = errorBody.error.code as OauthErrorCode
          console.log('ErrorCode:', errorCode)
          return { ok: false, errorCode }
        }
      }

      console.error('Request failed:', response)
      return { ok: false }
    }

    let body = (await response.json()) as { session: UserSession; workspaceId: string | null }

    return { ok: true, data: body }
  } catch (err) {
    console.log(err)
    return { ok: false }
  }
}

type GoogleSignInResponse = GithubSignInResponse

export const handleGoogleAuth = async (args: {
  code: string
  metadata?: any
  invitation?: string
}): Promise<GoogleSignInResponse> => {
  const { code, invitation, metadata } = args

  const payload = {
    code,
    invitation,
    metadata,
  }

  const url = getUrl('/auth/google')

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    const { ok, status } = response
    console.log(ok, status)
    console.log(status)

    if (!ok) {
      if (status === 400) {
        const errorBody = await response.json().catch(() => ({}))
        console.log('Error Body:', errorBody)

        if (errorBody?.error?.code) {
          const errorCode = errorBody.error.code as OauthErrorCode
          console.log('ErrorCode:', errorCode)
          return { ok: false, errorCode }
        }
      }

      console.error('Request failed:', response)
      return { ok: false }
    }

    let data = (await response.json()) as { session: UserSession; workspaceId: string | null }

    return { ok: true, data: data }
  } catch (err) {
    console.log('Error: ', err)
    return { ok: false }
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

export const handleEmailChangeConfirmation = async (token: string) => {
  const payload = {
    token,
  }

  const url = getUrl('/auth/change-email/confirm')

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
        error: { code: 'invalid_token' | 'token_expired' | 'email_not_available' }
      }

      return { ok: false, errorCode: body?.error?.code }
    } else return { ok: false }
  } catch (e) {
    return { ok: false }
  }
}

export const getSubscriptionSession = async (args: {
  accessToken: string
  //
  workspaceId: string
  sessionId: string
}) => {
  const { accessToken, workspaceId, sessionId } = args
  const url = getUrl(`/workspaces/${workspaceId}/subscription/session/${sessionId}`)

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
    let body = (await res.json()) as { plan: SubscriptionPlan }

    return body
  } catch (err) {
    return null
  }
}
