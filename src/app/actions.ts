'use server'

import { UserSession } from '@/types/session'
import { createSession } from '@/utils/auth/session'
import { cookies } from 'next/headers'

export async function saveSession(data: UserSession) {
  const session = await createSession(data)

  cookies().set('session', session, {
    httpOnly: true,
    maxAge: 60 * 60,
  })
}

export const deleteSession = () => {
  cookies().delete('session')
}
