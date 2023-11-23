import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // ...your post request logic here

  // Set json response first
  const response = NextResponse.json({ status: 200 })
  // Then set a cookie
  response.cookies.set({
    name: 'session',
    value: '',
    httpOnly: true,
    maxAge: 0,
  })

  return response
}
