import { UserSession } from '@/types/session'
import { sealData, unsealData } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const getSession = async (): Promise<UserSession | null> => {
  const cookieStore = cookies()

  const encryptedSession = cookieStore.get('session')?.value
  console.log(encryptedSession)

  const session = encryptedSession
    ? await unsealData<UserSession>(encryptedSession, {
        password: '44b87b09-59c8-4d5a-9ac8-fbb39b14988d',
      })
    : null

  if (!session) return null
  return JSON.parse(session as any)
}

export const createSession = async (sessionData: UserSession): Promise<string> => {
  const session = JSON.stringify(sessionData)
  console.log(session)

  const encryptedSession = await sealData(session, {
    password: '44b87b09-59c8-4d5a-9ac8-fbb39b14988d',
  })

  return encryptedSession
}

export const validateServerSession = async (
  redirectPath: string
): Promise<UserSession | null | never> => {
  const session = await getSession()

  if (!session) redirect(redirectPath)
  return session
}
