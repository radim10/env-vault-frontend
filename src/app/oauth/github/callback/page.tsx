'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

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

export default async function Page({ params }: { params: { code: string } }) {
  cookies().set('name', 'lee')

  // const { code } = params
  // const res = await getGithubUser(code)
  // console.log(code)
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
}
