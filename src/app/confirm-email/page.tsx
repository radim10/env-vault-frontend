import ConfirmEmail from '@/components/auth/ConfirmEmail'
import { redirect } from 'next/navigation'

const handleEmailConfirmation = async (token: string) => {
  const payload = {
    token,
  }

  try {
    const res = await fetch(`http://localhost:8080/api/v1/auth/email/confirm`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const status = res.status
    console.log(status)

    if (status === 204) {
      return { ok: true }
    } else if (status === 400) {
      let body = (await res.json()) as {
        error: { code: 'invalid_token' | 'token_expired' | 'email_already_confirmed' }
      }

      return { ok: false, errorCode: body?.error?.code }
    } else return { ok: false }
  } catch (e) {
    return { ok: false }
  }
}

interface Props {
  searchParams: {
    token?: string
  }
}

const ConfirmEmailPage: React.FC<Props> = async ({ searchParams }) => {
  if (!searchParams?.token) {
    redirect('/login')
  }

  const { ok, errorCode } = await handleEmailConfirmation(searchParams?.token)

  return <ConfirmEmail error={ok ? undefined : errorCode ?? 'unknown'} />
}

export default ConfirmEmailPage
