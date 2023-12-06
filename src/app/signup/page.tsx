import { redirectIfServerSession } from '@/utils/auth/session'

const SignUpPage = async () => {
  await redirectIfServerSession()

  return <SignUp />
}

export default SignUpPage
