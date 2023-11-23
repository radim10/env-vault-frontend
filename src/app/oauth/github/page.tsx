import { unsealData } from 'iron-session'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = cookies()

  const encryptedSession = cookieStore.get('session')?.value
  console.log(encryptedSession)

  const session = encryptedSession
    ? await unsealData(encryptedSession, {
        password: '44b87b09-59c8-4d5a-9ac8-fbb39b14988d',
      })
    : null

  console.log(session)

  return <div>{session ? JSON.parse(session as any)?.name : 'not authenticated'}</div>
}
