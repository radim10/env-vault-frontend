import { unsealData } from 'iron-session'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserSession } from './types/session'
import dayjs from 'dayjs'
import { createSession } from './utils/auth/session'

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

  if (
    session?.accessTokenExpiresAt &&
    dayjs.unix(session?.accessTokenExpiresAt).diff(dayjs(), 's') < 5 &&
    session?.refreshToken &&
    dayjs.unix(session?.accessTokenExpiresAt).diff(dayjs(), 's') < 5
  ) {
    console.log('refreshing session fron middleware')

    const res = await fetch('http://localhost:8080/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: session?.refreshToken,
      }),
    })

    // TODO: handle error
    let body = (await res.json()) as UserSession
    const newSession = await createSession(body)

    response.cookies.set('session', newSession, {
      httpOnly: true,
      maxAge: 86400 * 14,
    })
  }

  return response
}

export const config = {
  matcher: '/workspace',
}
