'use client'

import { useGetCheckoutUrl, useGetSubscription } from '@/api/queries/subscription'
import SubscriptionOverview from './SubscriptionOverview'
import PaymentDetails from './PaymentDetails'
import InvoiceList from './InvoiceList'
import useCurrentUserStore from '@/stores/user'
import { Skeleton } from '../ui/skeleton'
import SubscriptionLayout from './SubscriptionLayout'
import { Icons } from '../icons'
import { Button } from '../ui/button'

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

  const { data, isLoading, error } = useGetSubscription(workspaceId)

  return (
    <div className="flex flex-col gap-7 mt-2">
      {isLoading && (
        <>
          <Skeleton className="mt-0 border-2 h-80 w-full" />
          {isOwnerRole() === true && <Skeleton className=" border-2 h-40 w-full" />}
        </>
      )}
      {error && (
        <SubscriptionLayout title="Overview" icon={Icons.alignLeft}>
          <div className="h-44 flex flex-row items-center">
            <div className="flex flex-col gap-2 w-full items-center">
              <div className="text-red-600 text-[0.92rem]">Something went wrong</div>
              <div>
                <Button size={'sm'} variant="outline" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </SubscriptionLayout>
      )}
      {!isLoading && !error && (
        <>
          <SubscriptionOverview
            workspaceId={workspaceId}
            data={data.subscription}
            usersCount={data.usersCount}
          />
          {data.subscription?.payment && isOwnerRole() === true && (
            <PaymentDetails workspaceId={workspaceId} paymentData={data.subscription?.payment} />
          )}
        </>
      )}
      {isOwnerRole() === true && <InvoiceList workspaceId={workspaceId} />}
    </div>
  )
}

export default SubscriptionSettings
