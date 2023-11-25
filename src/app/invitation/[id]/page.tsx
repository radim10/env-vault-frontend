import { Invitation } from '@/components/Invitation'
import { WorkspaceUserRole } from '@/types/users'
import { getSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

// TODO: get invitation
const InvitaionPage = async (props: {}) => {
  const session = await getSession()

  if (session) redirect('/workspace')

  return <Invitation id="123" name="radim's workspace" role={WorkspaceUserRole.OWNER} />
}

export default InvitaionPage
