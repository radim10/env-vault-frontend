import { SubscriptionPlan } from '@/types/subscription'
import React, { useState } from 'react'
import SubscriptionPlanCard from './SubscriptionPlanCard'
import { useGetCheckoutUrl, useGetPreviewSubscriptionUpgrade } from '@/api/queries/subscription'
import { getPreviewUpgradeSubscription } from '@/api/requests/subscription'
import { Button } from '../ui/button'
import UpgradeSubscriptionDialog from './UpgradeSubscriptionDialog'
import CancelSubscriptionDialog from './CancelSubscriptionDialog'
import DowngradeSubscriptionDialog from './DowngradeSubscriptionDialog'

const feturesFree = {
  included: ['Unlimited meetings', 'Unlimited tasks', 'Unlimited notes'],
  locked: [
    'Meeting proposals',
    'Meeting templates',
    'Workskpace teams',
    'Priority support',
    'Multiple admins',
  ],
}

const featuresStartup = {
  included: [
    'Unlimited meetings',
    'Unlimited tasks',
    'Unlimited notes',
    'Meeting proposals',
    'Meeting templates',
    'Workskpace teams',
    'Multiple admins',
  ],
  locked: ['Priority support'],
}
const featuresEnterprise = {
  included: [...featuresStartup?.included, 'Priority support'],
}

interface Props {
  workspaceId: string
  currentPlan: SubscriptionPlan
  onClose: () => void
  //
  onCanceled: () => void
  onDowngraded: () => void
  onUpgraded: () => void
}

const SubscriptionPlanOverlay: React.FC<Props> = ({
  workspaceId,
  currentPlan,
  onClose,
  onCanceled,
  onDowngraded,
  onUpgraded,
}) => {
  const [loading, setLoading] = useState<'startup' | 'business' | false>(false)
  const [dialogOpened, setDialogOpened] = useState<'cancel' | 'downgrade' | null>(null)
  const [upgradeDialog, setUpgradeDialog] = useState<{
    amount: number
    opened: boolean
  } | null>(null)

  const {
    refetch: getPreviewUpdgrade,
    isRefetching: isRefetchingPreviewUpgrade,
    isFetching,
  } = useGetPreviewSubscriptionUpgrade(workspaceId, {
    enabled: false,
    cacheTime: 10,
    onSuccess: ({ invoice }) => {
      setUpgradeDialog({
        amount: invoice.amount,
        opened: true,
      })
    },
  })

  const items = [
    {
      plan: SubscriptionPlan.Free,
      features: feturesFree,
    },
    {
      plan: SubscriptionPlan.Startup,
      features: featuresStartup,
    },
    {
      plan: SubscriptionPlan.Business,
      features: featuresEnterprise,
    },
  ]

  const { refetch: refetchStartupUrl } = useGetCheckoutUrl(
    {
      workspaceId,
      plan: 'startup',
    },
    {
      enabled: false,
      onSuccess: ({ url }) => {
        window.location.href = url
      },
      onError: () => {
        setLoading(false)
      },
    }
  )

  const { refetch: refetchBusinessUrl } = useGetCheckoutUrl(
    {
      workspaceId,
      plan: 'business',
    },
    {
      enabled: false,
      onSuccess: ({ url }) => {
        window.location.href = url
      },
      onError: () => {
        setLoading(false)
      },
    }
  )

  const handleSelected = (plan: SubscriptionPlan) => {
    if (currentPlan === SubscriptionPlan.Free) {
      if (plan === SubscriptionPlan.Startup) {
        setLoading('startup')
        refetchStartupUrl()
      }
      if (plan === SubscriptionPlan.Business) {
        setLoading('business')
        refetchBusinessUrl()
      }
    } else if (currentPlan === SubscriptionPlan.Startup) {
      if (plan === SubscriptionPlan.Business) {
        getPreviewUpdgrade()
      } else {
        setDialogOpened('cancel')
      }
    } else {
      if (plan === SubscriptionPlan.Free) {
        setDialogOpened('cancel')
      } else {
        setDialogOpened('downgrade')
      }
    }
  }

  return (
    <>
      <div className="fixed wrapper inset-0 z-[20000] overflow-y-scroll ">
        <div className=" items-center justify-center  min-h-screen pt-4 lg:px-4 pb-20 text-center flex sm:p-0 ">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
            aria-hidden="true"
            onClick={() => {
              if (dialogOpened === null && upgradeDialog === null) {
                onClose()
              } else {
                // setDialogOpened(null)
              }
            }}
          />
          <div className=" relative animate-in slide-in-from-right duration-300">
            {dialogOpened === null && upgradeDialog === null && (
              <div className="fly-this">
                <div className="flex gap-2 flex-wrap justify-center m-auto md:justify-start lg:w-full w-[16rem] ">
                  {items.map((item) => (
                    <SubscriptionPlanCard
                      plan={item.plan}
                      features={item.features}
                      isCurrent={item.plan === currentPlan}
                      isNextPeriodActive={false}
                      disabled={
                        (item.plan === SubscriptionPlan.Free && loading !== false) ||
                        (item.plan === SubscriptionPlan.Startup && loading == 'business') ||
                        (item.plan === SubscriptionPlan.Business && loading == 'startup') ||
                        ((isRefetchingPreviewUpgrade || isFetching) &&
                          item.plan !== SubscriptionPlan.Startup)
                      }
                      loading={
                        (item.plan === SubscriptionPlan.Startup && loading === 'startup') ||
                        (item.plan === SubscriptionPlan.Business && loading === 'business') ||
                        ((isRefetchingPreviewUpgrade || isFetching) &&
                          item.plan === SubscriptionPlan.Business)
                      }
                      key={item.plan}
                      onSelect={() => {
                        handleSelected(item.plan)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            {dialogOpened === 'cancel' && (
              <CancelSubscriptionDialog
                workspaceId={workspaceId}
                onSuccess={() => onCanceled()}
                onClose={() => setDialogOpened(null)}
              />
            )}

            {dialogOpened === 'downgrade' && (
              <DowngradeSubscriptionDialog
                workspaceId={workspaceId}
                onSuccess={() => onDowngraded()}
                onClose={() => setDialogOpened(null)}
              />
            )}
            {upgradeDialog?.opened && (
              <UpgradeSubscriptionDialog
                workspaceId={workspaceId}
                amountDue={upgradeDialog.amount}
                onClose={() => {
                  setUpgradeDialog(null)
                }}
                onSuccess={() => onUpgraded()}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SubscriptionPlanOverlay
