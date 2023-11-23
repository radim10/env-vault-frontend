'use server'

import { createSession } from '@/utils/auth/session'
import { cookies } from 'next/headers'

export async function saveSession() {
  const session =await createSession()

  cookies().set('session', session, {
    httpOnly: true,
    maxAge: 60 * 60,
  })
}
