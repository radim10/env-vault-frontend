'use client'
import { useCallback, useState } from 'react'
import { Icons } from '../icons'
import SubscriptionLayout from './SubscriptionLayout'
import { Progress } from '@/components/ui/progress'
import SubscriptionPlanOverlay from './SubscriptionPlanOverlay'
import { useLockBodyScroll } from 'react-use'
import { SubscriptionPlan, SubscriptionOverview, SubscriptionData } from '@/types/subscription'
import dayjs from 'dayjs'
import clsx from 'clsx'
import useCurrentUserStore from '@/stores/user'
import RenewSubscriptionDialog from './RenewSubscriptionDialog'
import { useToast } from '../ui/use-toast'
import UndoDowngradeSubscriptionDialog from './UndoDowngradeDialog'
import { useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

interface Props {
  workspaceId: string
  //
  usersCount: number
  data: SubscriptionOverview
}

const SubscriptionOverview: React.FC<Props> = ({
  workspaceId,
  usersCount,
  data: {
    plan,
    cancelAt,
    downgradeAt,
    canceledAt,
    downgradedAt,
    handoverSentAt,
    billingCycleAnchor,
  },
}) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const activeSubscriptionPlan = useCurrentUserStore(
    ({ data }) => data?.selectedWorkspace?.plan || SubscriptionPlan.Free
  )
  const [overlayOpened, setOverlayOpened] = useState(false)
  const [renewDialog, setRenewDialog] = useState<{
    opend: boolean
  } | null>(null)
  const [undoDowngradeDialog, setUndoDowngradeDialog] = useState<{
    opend: boolean
  } | null>(null)

  useLockBodyScroll(overlayOpened)

  const progress = useCallback(() => {
    if (plan === SubscriptionPlan.Free) {
      if (usersCount === 5) {
        return 0
      } else {
        return (usersCount / 5) * 100
      }
    } else if (plan === SubscriptionPlan.Startup) {
      if (usersCount === 50) {
        return 0
      } else {
        return (usersCount / 50) * 100
      }
    } else if (plan === SubscriptionPlan.Business) {
      return 0
    }

    return 0
  }, [usersCount, plan])

  const closeRenewDialog = () => {
    setRenewDialog({ opend: false })

    setTimeout(() => {
      setRenewDialog(null)
    }, 150)
  }

  const handleRenewSuccess = () => {
    closeRenewDialog()
    updateSubsciptionState({
      canceled: false,
    })
    toast({
      variant: 'success',
      title: 'Subscription renewed',
    })
  }

  const closeUndoDowngradeDialog = () => {
    setUndoDowngradeDialog({ opend: false })

    setTimeout(() => {
      setUndoDowngradeDialog(null)
    }, 150)
  }

  const handleUndoDowngradeSuccess = () => {
    closeUndoDowngradeDialog()
    toast({
      variant: 'success',
      title: 'Action successful',
      description: 'Workspace subscription wont be downgraded',
    })

    updateSubsciptionState({
      downgraded: false,
    })
  }

  const updateSubsciptionState = (args: { canceled?: boolean; downgraded?: boolean }) => {
    const data = queryClient.getQueryData<SubscriptionData>(['subscription', workspaceId])
    console.log(data)

    if (!data) return

    const updatedData = produce(data, (draft) => {
      draft.subscription.downgradeAt =
        args.downgraded === true ? calculateNextBillingDate(billingCycleAnchor) : undefined
      draft.subscription.cancelAt =
        args.canceled === true ? calculateNextBillingDate(billingCycleAnchor) : undefined
    })

    console.log(updatedData)

    queryClient.setQueryData(['subscription', workspaceId], updatedData)
  }

  const handleDowgradeSuccess = () => {
    setOverlayOpened(false)
    updateSubsciptionState({
      downgraded: true,
    })
    toast({
      variant: 'success',
      title: 'Action successful',
      description: 'Workspace subscription willd be downgraded',
    })
  }

  const handleCancelSuccess = () => {
    setOverlayOpened(false)
    updateSubsciptionState({
      canceled: true,
    })
    toast({
      variant: 'success',
      title: 'Action successful',
      description: 'Workspace subscription willd be canceled',
    })
  }

  return (
    <>
      {renewDialog !== null && cancelAt && (
        <RenewSubscriptionDialog
          opened={renewDialog.opend}
          workspaceId={workspaceId}
          cancelAt={cancelAt}
          onSuccess={handleRenewSuccess}
          onClose={closeRenewDialog}
        />
      )}
      {undoDowngradeDialog !== null && downgradeAt && (
        <UndoDowngradeSubscriptionDialog
          opened={undoDowngradeDialog.opend}
          workspaceId={workspaceId}
          cancelAt={downgradeAt}
          onClose={closeUndoDowngradeDialog}
          onSuccess={handleUndoDowngradeSuccess}
        />
      )}
      {overlayOpened && (
        <SubscriptionPlanOverlay
          workspaceId={workspaceId}
          currentPlan={activeSubscriptionPlan}
          onClose={() => setOverlayOpened(false)}
          onCanceled={() => handleCancelSuccess()}
          onDowngraded={() => handleDowgradeSuccess()}
          onUpgraded={() => {}}
        />
      )}
      <SubscriptionLayout title="Overview" icon={Icons.alignLeft}>
        <div className="flex flex-col md:flex-row gap-2 md:gap-16 xl:gap-20">
          <div>
            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Current plan
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div
                className={clsx([' text-[0.96rem]'], {
                  'text-blue-500': plan === SubscriptionPlan.Startup,
                  'text-green-500': plan === SubscriptionPlan.Business,
                })}
              >
                {plan === SubscriptionPlan.Free && 'Free'}
                {plan === SubscriptionPlan.Startup && 'Startup'}
                {plan === SubscriptionPlan.Business && 'Business'}
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Plan price
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">
              {plan === SubscriptionPlan.Free && '$0 user/mo'}
              {plan === SubscriptionPlan.Startup && '$10 user/mo'}
              {plan === SubscriptionPlan.Business && '$16 user/mo'}
            </div>
          </div>
          <>
            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Next billing amount
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-[0.96rem]">
                {!cancelAt && (
                  <>
                    {plan === SubscriptionPlan.Free && (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                    {plan === SubscriptionPlan.Startup && `$${usersCount * 10}`}
                    {plan === SubscriptionPlan.Business && `$${usersCount * 16}`}
                  </>
                )}
                {cancelAt && (
                  <>
                    <span className="text-muted-foreground">N/A</span>
                  </>
                )}
              </div>
            </div>

            {!canceledAt && !cancelAt && (
              <div className="flex flex-row md:flex-col gap-0.5">
                <div className="font-semibold text-[0.96rem]">
                  Next billing date
                  <span className="inline md:hidden">{': '}</span>
                </div>

                <div className="text-[0.96rem]">
                  {billingCycleAnchor &&
                    dayjs(calculateNextBillingDate(billingCycleAnchor))?.format('YYYY-MM-DD')}
                  {!billingCycleAnchor && <span className="text-muted-foreground">N/A</span>}
                </div>
              </div>
            )}

            {canceledAt && (
              <div className="flex flex-row md:flex-col gap-0.5">
                <div className="font-semibold text-[0.96rem]">
                  {'Canceled on'}
                  <span className="inline md:hidden">{': '}</span>
                </div>

                <div className="text-[0.96rem]">{dayjs(canceledAt)?.format('YYYY-MM-DD')}</div>
              </div>
            )}

            {cancelAt && (
              <div className="flex flex-row md:flex-col gap-0.5">
                <div className="font-semibold text-[0.96rem]">
                  {dayjs(cancelAt).isBefore(dayjs()) ? 'Canceled on' : 'Cancel on'}
                  <span className="inline md:hidden">{': '}</span>
                </div>

                <div className="text-[0.96rem]">
                  {cancelAt && dayjs(cancelAt)?.format('YYYY-MM-DD')}
                </div>
              </div>
            )}

            {downgradeAt && (
              <div className="flex flex-row md:flex-col gap-0.5">
                <div className="font-semibold text-[0.96rem]">
                  Downgrade on
                  <span className="inline md:hidden">{': '}</span>
                </div>

                <div className="text-[0.96rem]">{dayjs(downgradeAt)?.format('YYYY-MM-DD')}</div>
              </div>
            )}

            {downgradedAt && (
              <div className="flex flex-row md:flex-col gap-0.5">
                <div className="font-semibold text-[0.96rem]">
                  Downgraded on
                  <span className="inline md:hidden">{': '}</span>
                </div>

                <div className="text-[0.96rem]">{dayjs(downgradedAt)?.format('YYYY-MM-DD')}</div>
              </div>
            )}
          </>
        </div>
        {/* // */}
        <div className="mt-7">
          <div className="flex flex-row justify-between items-center">
            <div className="font-semibold text-[1.1rem]">Plan usage</div>
            <div className="pr-2 flex flex-row items-center gap-3 md:gap-3">
              {cancelAt && (
                <>
                  <button
                    className="text-[0.92rem] hover:text-primary ease duration-100"
                    onClick={() => setRenewDialog({ opend: true })}
                  >
                    Renew
                  </button>
                  <div className="h-5 w-[1px] bg-muted-foreground opacity-30"></div>
                </>
              )}

              {downgradeAt && (
                <>
                  <button
                    className="text-[0.92rem] hover:text-primary ease duration-100"
                    onClick={() => setUndoDowngradeDialog({ opend: true })}
                  >
                    Undo downgrade
                  </button>
                  <div className="h-5 w-[1px] bg-muted-foreground opacity-30"></div>
                </>
              )}

              {/* {!cancelAt && ( */}
              <button
                className="text-[0.92rem] hover:text-primary ease duration-100"
                onClick={() => setOverlayOpened(true)}
              >
                Change plan
              </button>
              {/* )} */}
            </div>
          </div>
          <div className="px-0 mt-3.5">
            <div className="w-full border-2 rounded-md md:px-6 px-3 py-4">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                  <div className="font-semibold">Number of workspace users</div>
                  <div className="text-muted-foreground text-[0.98rem]">
                    Active users in this workspace
                  </div>
                </div>
                <div className="text-[0.98rem]">
                  {usersCount} /{' '}
                  {plan === SubscriptionPlan.Free
                    ? '5'
                    : plan === SubscriptionPlan.Startup
                    ? '50'
                    : '50+'}
                </div>
              </div>
              {/* // */}

              <div className="mt-4 pb-1.5">
                <Progress
                  value={progress()}
                  className={clsx(['w-full h-3'], {
                    'bg-red-600 dark:bg-red-700':
                      (usersCount === 5 && plan === SubscriptionPlan.Free) ||
                      (usersCount === 50 && plan === SubscriptionPlan.Startup),
                    'bg-green-600 dark:bg-green-700': plan === SubscriptionPlan.Business,
                  })}
                />
              </div>
            </div>
          </div>
        </div>
        {/* // */}
      </SubscriptionLayout>
    </>
  )
}

const calculateNextBillingDate = (cycleAnchor: string): string => {
  const currentDate = dayjs()
  const anchorDate = dayjs(cycleAnchor)
  const billingDateThisMonth = anchorDate.month(currentDate.month()).year(currentDate.year())
  console.log(billingDateThisMonth.format('YYYY-MM-DD'))
  console.log(billingDateThisMonth)
  const date = currentDate.isBefore(billingDateThisMonth)
    ? billingDateThisMonth.format()
    : billingDateThisMonth.add(1, 'month').format()
  return date
}

export default SubscriptionOverview
