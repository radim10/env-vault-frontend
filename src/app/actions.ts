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

export const getCurrentUserData = async () => {
  const res = await fetch(`http://localhost:8080/api/v1/workspaces/3434/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = res.json()
  return body
}
