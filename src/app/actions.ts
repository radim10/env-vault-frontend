'use server'

import { createSession } from '@/utils/auth/session'
import { cookies } from 'next/headers'

export async function saveSession(accessToken: string) {
  const session = await createSession(accessToken)

  cookies().set('session', session, {
    httpOnly: true,
    maxAge: 60 * 60,
  })
}
