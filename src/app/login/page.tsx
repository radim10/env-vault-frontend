import Login from '@/components/auth/Login'
import { getSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

const LoginPage = async () => {
  const session = await getSession()

  if (session) {
    redirect('/workspace')
  }

  return <Login />
}

export default LoginPage
