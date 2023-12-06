import SignUp from '@/components/auth/SignUp'
import { getSession } from '@/utils/auth/session'

const SignUpPage = async () => {
  const session = await getSession()

  if (session) {
    redirect('/workspace')
  }
  return <SignUp />
}

export default SignUpPage
