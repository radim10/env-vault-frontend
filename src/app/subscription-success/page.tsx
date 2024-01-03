import { Metadata } from 'next'
import { getSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'
import { getSubscriptionSession } from '@/utils/serverRequests'
import { uuidRegex } from '@/utils/uuid'
import SubscriptionSuccess from '@/components/subscription/SubscriptionSuccess'

export const metadata: Metadata = {
  title: 'Subscription success',
}

export default async function SubscriptionSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const currentUser = await getSession()
  const stripeSessionId = searchParams?.session as string | undefined
  const workspaceId = searchParams?.workspace as string | undefined

  console.log('stripe session id', stripeSessionId)

  if (!currentUser) redirect('/login')
  if (!workspaceId || !uuidRegex.test(workspaceId)) redirect(`/workspace`)

  if (!stripeSessionId?.startsWith('cs_')) {
    redirect(`/workspace`)
  }

  const stripeSession = await getSubscriptionSession({
    workspaceId,
    sessionId: stripeSessionId,
    accessToken: currentUser?.accessToken,
  })

  console.log('stripe session', stripeSession)

  if (!stripeSession) {
    redirect(`/workspace`)
  }

  return <SubscriptionSuccess plan={stripeSession?.plan} workspaceId={workspaceId} />
}
