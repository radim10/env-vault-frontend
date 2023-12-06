import { Invitation } from '@/components/Invitation'
import { redirectIfServerSession } from '@/utils/auth/session'
import { getInvitation } from '@/utils/serverRequests'
import { redirect } from 'next/navigation'

const InvitaionPage = async ({ params }: { params: { id: string; method: string } }) => {
  await redirectIfServerSession()

  const method = params?.method

  if (method !== 'login' && method !== 'signup') {
    redirect(`/invitation/${params.id}/login`)
  }

  const invitation = await getInvitation(params.id)
  //
  if (!invitation) {
    redirect('/login')
  }

  // return <Invitation id={'dsdsa'} workspace={'dsad'} role={'ADMIN' as any} type={method} />
  return (
    <Invitation
      id={params?.id}
      workspace={invitation?.workspace}
      role={invitation?.role}
      type={method}
    />
  )
}

export default InvitaionPage
