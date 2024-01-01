import { unsealData } from 'iron-session'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserSession } from './types/session'
import dayjs from 'dayjs'
import { createSession } from './utils/auth/session'
import { getUrl } from './utils/serverRequests'

// TODO: handle error
export async function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('session')?.value

  const session = cookie
    ? await unsealData<UserSession>(cookie, {
        password: '44b87b09-59c8-4d5a-9ac8-fbb39b14988d',
      })
    : null

  const response = NextResponse.next()

  console.log(
    session?.accessTokenExpiresAt &&
      dayjs.unix(session?.accessTokenExpiresAt).diff(dayjs(), 's') < 5 &&
      session?.refreshToken &&
      dayjs.unix(session?.refreshTokenExpiresAt).diff(dayjs(), 's') > 5
  )
  if (
    session?.accessTokenExpiresAt &&
    dayjs.unix(session?.accessTokenExpiresAt).diff(dayjs(), 's') < 5 &&
    session?.refreshToken &&
    dayjs.unix(session?.refreshTokenExpiresAt).diff(dayjs(), 's') > 5
  ) {
    console.log('refreshing session fron middleware')
    const url = getUrl('/auth/refresh')

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: session?.refreshToken,
      }),
    })

    const status = res.status
    console.log({ status })

    if (status === 400 || status === 401) {
      console.log('session expired, removing session cookie')
      response.cookies.delete('session')
      //
    } else {
      let body = (await res.json()) as UserSession
      console.log(body)
      const newSession = await createSession(body)

      response.cookies.set('session', newSession, {
        httpOnly: true,
        maxAge: 86400 * 14,
      })
    }
  }

  return response
}

export const config = {
  matcher: '/workspace',
}
