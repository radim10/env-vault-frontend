'use client'

import { useGetCheckoutUrl } from '@/api/queries/subscription'
import SubscriptionOverview from './SubscriptionOverview'
import PaymentDetails from './PaymentDetails'
import InvoiceList from './InvoiceList'

interface Props {
  workspaceId: string
}

const SubscriptionSettings: React.FC<Props> = ({ workspaceId }) => {
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

  return (
    <div className="flex flex-col gap-7">
      {/* <Button onClick={() => refetch()}>Get url</Button> */}
      <SubscriptionOverview workspaceId={workspaceId} />
      <PaymentDetails />
      <InvoiceList />
    </div>
  )
}

export default SubscriptionSettings
