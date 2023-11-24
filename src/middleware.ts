import { unsealData } from 'iron-session'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserSession } from './types/session'

export async function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('session')?.value

  const session = cookie
    ? await unsealData<UserSession>(cookie, {
        password: '44b87b09-59c8-4d5a-9ac8-fbb39b14988d',
      })
    : null

  console.log(session)

  // if (!session) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  //
  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next()

  return response
}

export const config = {
  matcher: '/workspace',
}
