import { SubscriptionPlan } from '@/types/subscription'
import clsx from 'clsx'
import { Icons } from '../icons'
import { Button } from '../ui/button'

interface Props {
  features: {
    included: string[]
    locked?: string[]
  }
  plan: SubscriptionPlan
  isCurrent?: boolean
  isNextPeriodActive?: boolean
  disabled?: boolean
  loading?: boolean
  onSelect?: () => void
}

const SubscriptionPlanCard: React.FC<Props> = ({
  plan,
  features,
  isCurrent,
  isNextPeriodActive,
  disabled,
  loading,
  onSelect,
}) => {
  return (
    <div>
      <div
        className={clsx(
          [
            'bg-background dark:bg-background border-2 w-[17rem]X w-[20rem]  rounded-xl shadow-md  ease duration-300',
          ],
          {
            'hover:scale-[1.03] hover:shadow-2xl': !isCurrent && !disabled && !isNextPeriodActive,
            'border-gray-300 dark:border-gray-700': plan === SubscriptionPlan.Free,
            'border-blue-500 dark:border-blue-800': plan === SubscriptionPlan.Startup,
            'border-green-500 dark:border-green-800': plan === SubscriptionPlan.Business,
          }
        )}
      >
        <div className=" py-2.5 pb-6 px-2 h-full">
          <div className="px-4 py-2 flex flex-col gap-0.5">
            {/* <div>Icon</div> */}

            <div className="font-bold text-[1.23rem] dark:text-gray-200">
              {plan === SubscriptionPlan.Free && 'Free'}
              {plan === SubscriptionPlan.Startup && 'Startup'}
              {plan === SubscriptionPlan.Business && 'Business'}
            </div>
            <div className="text-[0.87rem] text-gray-600 dark:text-gray-400 -mt-1">
              {plan === SubscriptionPlan.Free && 'Up to 5 users'}
              {plan === SubscriptionPlan.Startup && 'Up to 50 users'}
              {plan === SubscriptionPlan.Business && 'More than 50 users'}
            </div>
          </div>

          <div className="pl-4 text-[1rem] flex flex-row items-center gap-2 justify-start mb-3">
            {plan === SubscriptionPlan.Free && <span>Everything to get started</span>}
            {plan === SubscriptionPlan.Startup && (
              <span>
                Everything incldued in <b>Free</b> plus...
              </span>
            )}
            {plan === SubscriptionPlan.Business && <span>All features available...</span>}
          </div>

          <div className="pl-4 flex flex-col gap-1 mt-2">
            {features.included.map((feature) => (
              <div className="feature flex gap-2.5 items-center ">
                <Icons.checkCircle2 className="h-[1.2rem] w-[1.2rem] text-primary" />
                <span className="text-[0.95Rem] dark:text-gray-300">{feature}</span>
              </div>
            ))}
            {features.locked?.map((feature) => (
              <div className="feature flex gap-2.5 items-center ">
                <Icons.xCircle className="h-[1.2rem] w-[1.2rem] dark:text-gray-400" />
                <span className="text-[0.95rem] text-gray-500 dark:text-gray-400">{feature}</span>
              </div>
            ))}
          </div>

          <div className="px-4 mt-6 justify-start">
            <div className="flex gap-2 items-center pl-1">
              <span className="font-bold text-[2.2rem] dark:text-gray-200">
                {plan === SubscriptionPlan.Free && '$0'}
                {plan === SubscriptionPlan.Startup && '$10'}
                {plan === SubscriptionPlan.Business && '$16'}
              </span>
              <div className="flex flex-col items-start text-[0.8rem] text-foreground-muted">
                <span>per user</span>
                <span>per month</span>
              </div>
            </div>
          </div>

          <div className="mt-4 px-5">
            {isCurrent || isNextPeriodActive ? (
              <Button size={'sm'} className="w-full" variant={'secondary'} disabled={true}>
                {isNextPeriodActive ? 'After current period' : 'Current plan'}
              </Button>
            ) : (
              <Button
                size={'sm'}
                className="w-full"
                variant={'outline'}
                onClick={onSelect}
                disabled={disabled && !loading}
                loading={loading}
              >
                Select
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlanCard
