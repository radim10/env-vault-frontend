'use client'

import { useGetCheckoutUrl, useGetSubscription } from '@/api/queries/subscription'
import SubscriptionOverview from './SubscriptionOverview'
import PaymentDetails from './PaymentDetails'
import InvoiceList from './InvoiceList'
import useCurrentUserStore from '@/stores/user'

interface Props {
  workspaceId: string
}

const SubscriptionSettings: React.FC<Props> = ({ workspaceId }) => {
  const { isOwnerRole } = useCurrentUserStore()
  const { refetch } = useGetCheckoutUrl(
    {
      workspaceId,
      plan: 'startup',
    },
    {
      enabled: false,
      onSuccess: ({ url }) => {
        window.location.href = url
      },
    }
  )

  const { data, isLoading, isError } = useGetSubscription(workspaceId)

  if (isLoading) {
    return <>Loading...</>
  }

  if (isError) {
    return <>Error</>
  }

  return (
    <div className="flex flex-col gap-7">
      {/* <Button onClick={() => refetch()}>Get url</Button> */}
      <SubscriptionOverview
        workspaceId={workspaceId}
        data={data.subscription}
        usersCount={data.usersCount}
      />
      {data.subscription?.payment && isOwnerRole() === true && (
        <PaymentDetails workspaceId={workspaceId} paymentData={data.subscription?.payment} />
      )}
      {isOwnerRole() === true && <InvoiceList workspaceId={workspaceId} />}
    </div>
  )
}

export default SubscriptionSettings
