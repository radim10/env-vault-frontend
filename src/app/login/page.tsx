import Login from '@/components/auth/Login'
import { redirectIfServerSession } from '@/utils/auth/session'

const LoginPage = async () => {
  await redirectIfServerSession()

  return <Login />
}

export default LoginPage
