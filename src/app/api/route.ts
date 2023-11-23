'use server'

import { sealData } from 'iron-session'
import { cookies } from 'next/headers'

// // endpoint to log in a user
// export async function POST() {
//   const session = JSON.stringify({
//     userId: 1,
//     name: 'john doe',
//
//   })
//   console.log(session)
//
//   const encryptedSession = await sealData(session, {
//     password: '44b87b09-59c8-4d5a-9ac8-fbb39b14988d',
//   })
//
//   //
//   return new Response('ok', {
//     status: 200,
//     headers: { 'Set-Cookie': `session=${encryptedSession}` },
//   })
// }
//
//
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // ...your post request logic here

  // Set json response first
  const response = NextResponse.json({ status: 200 })

  const session = JSON.stringify({
    userId: 1,
    name: 'john doe',
  })
  console.log(session)

  const encryptedSession = await sealData(session, {
    password: '44b87b09-59c8-4d5a-9ac8-fbb39b14988d',
  })

  // Then set a cookie
  response.cookies.set({
    name: 'session',
    value: encryptedSession,
    httpOnly: true,
    maxAge: 60 * 60,
  })

  return response
}
