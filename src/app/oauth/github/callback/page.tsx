import { CookieAuth } from '@/components/CookieAuth'
import { UserSession } from '@/types/session'
import { createSession } from '@/utils/auth/session'

// import { Session } from '@/types/auth'
//
async function getGithubUser(code: string) {
  // const res = await fetch(`${process.env.API_URL}/auth/github`, {
  const res = await fetch(`http://localhost:8080/api/v1/auth/github`, {
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

async function getDefaultWorkspace() {
  const { data } = await new Promise((resolve) => setTimeout(resolve, 250)).then(() => ({
    data: { id: '4ef8a291-024e-4ed8-924b-1cc90d01315e' },
  }))

  return data
}

export default async function Page({ searchParams }: { searchParams: { code: string } }) {
  // setCookie('key', 'value')
  // console.log(searchParams)
  // console.log(searchParams?.code)
  //
  const res = (await getGithubUser(searchParams?.code)) as UserSession
  const workspaceData = await getDefaultWorkspace()
  // console.log(res)
  // const res = await fetch('http://localhost:3000/api', { method: 'POST' })
  // console.log(res)
  // return (
  //   <button
  //     onClick={async () => {
  //       const res = await fetch('http://localhost:3000/api', { method: 'POST' })
  //       console.log(res)
  //     }}
  //   >
  //     button
  //   </button>
  // )
  // cookies().set('name', 'lee')
  // const { code } = params
  // redirect('/')
  //
  //   const userData = (await getGithubUser(code)) as Session
  //   if (!userData) {
  //     redirect("/auth/login")
  //   } else {
  //     const { ok, status, headers } = await fetch(
  //       "http://localhost:3000/api/login",
  //       {
  //         method: "POST",
  //         body: JSON.stringify(userData),
  //       }
  //     )
  //     console.log("LOGIN OK: ", ok)
  //     console.log("LOGIN STATUS: ", status)
  //     console.log("LOGIN header: ", headers)
  //
  //     //await login
  //     // redirect("/")
  //   }

  return <CookieAuth data={res} workspaceId={workspaceData?.id} />
}
