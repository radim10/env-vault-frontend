import { SubscriptionPlan } from '@/types/subscription'
import React, { useState } from 'react'
import SubscriptionPlanCard from './SubscriptionPlanCard'
import { useGetCheckoutUrl } from '@/api/queries/subscription'

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
  onClose: () => void
}

const SubscriptionPlanOverlay: React.FC<Props> = ({ workspaceId, onClose }) => {
  const [loading, setLoading] = useState<'startup' | 'business' | false>(false)

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

  return (
    <div className="fixed wrapper inset-0 z-[20000] overflow-y-scroll ">
      <div className=" items-center justify-center  min-h-screen pt-4 lg:px-4 pb-20 text-center flex sm:p-0 ">
        <div
          className="fixed inset-0 bg-gray-500 dark:bg-gray-900 dark:bg-opacity-[92%] bg-opacity-[92%] backdrop-blur-sm?? transition-opacity"
          aria-hidden="true"
          onClick={() => onClose()}
        />
        <div className=" relative">
          <div className="fly-this">
            <div className="flex gap-2 flex-wrap justify-center m-auto md:justify-start lg:w-full w-[16rem]">
              {/* // map */}
              {items.map((item) => (
                <SubscriptionPlanCard
                  plan={item.plan}
                  features={item.features}
                  isCurrent={false}
                  current={SubscriptionPlan.Free}
                  isNextPeriodActive={false}
                  disabled={
                    (item.plan === SubscriptionPlan.Free && loading !== false) ||
                    (item.plan === SubscriptionPlan.Startup && loading == 'business') ||
                    (item.plan === SubscriptionPlan.Business && loading == 'startup')
                  }
                  loading={
                    (item.plan === SubscriptionPlan.Startup && loading === 'startup') ||
                    (item.plan === SubscriptionPlan.Business && loading === 'business')
                  }
                  key={item.plan}
                  onSelect={() => {
                    if (item.plan === SubscriptionPlan.Startup) {
                      setLoading('startup')
                      refetchStartupUrl()
                    }
                    if (item.plan === SubscriptionPlan.Business) {
                      setLoading('business')
                      refetchBusinessUrl()
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlanOverlay
