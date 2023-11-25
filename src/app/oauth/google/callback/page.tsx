import { CookieAuth } from '@/components/CookieAuth'
import { UserSession } from '@/types/session'

// import { Session } from '@/types/auth'
//
async function handleGoogleAuth(code: string) {
  // const res = await fetch(`${process.env.API_URL}/auth/github`, {
  const res = await fetch(`http://localhost:8080/api/v1/auth/google`, {
    method: 'POST',
    body: JSON.stringify({ code }),
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

// async function getDefaultWorkspace() {
//   const { data } = await new Promise((resolve) => setTimeout(resolve, 250)).then(() => ({
//     data: { id: '4ef8a291-024e-4ed8-924b-1cc90d01315e' },
//   }))
//
//   return data
// }
//
const getDefaultWorkspace = async (session?: UserSession) => {
  const res = await fetch(`http://localhost:8080/api/v1/me/default-workspace`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = (await res.json()) as { id: string | null }

  return body
}

export default async function Page({ searchParams }: { searchParams: { code: string } }) {
  console.log('Code: ', searchParams?.code)
  const res = (await handleGoogleAuth(searchParams?.code)) as UserSession
  const workspaceData = await getDefaultWorkspace()

  if (!workspaceData) {
    return <>Something went wrong</>
  }

  return <CookieAuth data={res} workspaceId={workspaceData?.id} />
}
