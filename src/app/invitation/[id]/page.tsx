import { Invitation } from '@/components/Invitation'
import { WorkspaceUserRole } from '@/types/users'
import { getSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

async function getInvitation(id: string) {
  const res = await fetch(`http://localhost:8080/api/v1/invitations/${id}`, {
    method: 'GET',
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = await res.json()
  return body as { workspace: string; role: WorkspaceUserRole }
}

const InvitaionPage = async ({ params }: { params: { id: string } }) => {
  const session = await getSession()
  if (session) redirect('/workspace')

  // const invitation = await getInvitation(params.id)
  //
  // if (!invitation) {
  //   redirect('/login')
  // }

  return <></>
  // return <Invitation id={'dsdsa'} workspace={'dsad'} role={'ADMIN' as any} />
  // return <Invitation id={params?.id} workspace={invitation?.workspace} role={invitation?.role} />
}

export default InvitaionPage
