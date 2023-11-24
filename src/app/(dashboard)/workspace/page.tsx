import { validateServerSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

// TODO: get default workspace and redirect
const WorkspacePage = async (props: {}) => {
  await validateServerSession('/login')
  redirect(`/workspace/4ef8a291-024e-4ed8-924b-1cc90d01315e/projects`)
}

export default WorkspacePage
