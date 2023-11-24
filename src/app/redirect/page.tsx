import { validateServerSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

async function getDefaultWorkspace() {
  // const res = await fetch(`${process.env.API_URL}/auth/github`, {
  //   const res = await fetch(`http://localhost:8080/api/v1/auth/github`, {
  //     method: 'POST',
  //     body: JSON.stringify({ code }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     cache: 'no-store',
  //   })
  //
  //   console.log(res.status)
  //   if (!res.ok) return undefined
  //   let body = res.json()
  //   return body
  const { data } = await new Promise((resolve) => setTimeout(resolve, 250)).then(() => ({
    data: { id: '4ef8a291-024e-4ed8-924b-1cc90d01315e' },
  }))

  return data
}

const redirectPage = async (props: {}) => {
  await validateServerSession('/login')
  const workspaceData = await getDefaultWorkspace()

  redirect(`/workspace/${workspaceData?.id}/projects`)

  return <div>redirect page</div>
}

export default redirectPage
