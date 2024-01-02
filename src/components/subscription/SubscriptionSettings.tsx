'use client'

import { useGetCheckoutUrl } from '@/api/queries/subscription'
import { Button } from '../ui/button'
import SubscriptionOverview from './SubscriptionOverview'

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
    <div>
      {/* <Button onClick={() => refetch()}>Get url</Button> */}
      <SubscriptionOverview />
    </div>
  )
}

export default SubscriptionSettings
