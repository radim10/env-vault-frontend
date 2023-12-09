import ConfirmEmail from '@/components/auth/ConfirmEmail'
import { redirectIfServerSession } from '@/utils/auth/session'
import { handleEmailChangeConfirmation, handleEmailConfirmation } from '@/utils/serverRequests'
import { redirect } from 'next/navigation'

interface Props {
  searchParams: {
    token?: string
  }
}

const ConfirmEmailPage: React.FC<Props> = async ({ searchParams }) => {
  await redirectIfServerSession()

  if (!searchParams?.token) {
    redirect('/login')
  }

  const { ok, errorCode } = await handleEmailChangeConfirmation(searchParams?.token)

  return <ConfirmEmail error={ok ? undefined : errorCode ?? 'unknown'} isChange={true} />
}

export default ConfirmEmailPage
