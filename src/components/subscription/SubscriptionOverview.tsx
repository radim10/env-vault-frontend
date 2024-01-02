import { Icons } from '../icons'
import { Button } from '../ui/button'
import SubscriptionLayout from './SubscriptionLayout'
import { Progress } from '@/components/ui/progress'

const SubscriptionOverview = (props: {}) => {
  return (
    <div className="flex flex-col gap-7">
      <SubscriptionLayout title="Overview" icon={Icons.alignLeft}>
        <div className="flex flex-col md:flex-row gap-2 md:gap-16 xl:gap-20">
          <div>
            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Current plan
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-green-500 text-[0.96rem]">Startup </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Current plan
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">$10 user/month</div>
          </div>
          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Next billing date
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">2024-01-01</div>
          </div>

          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Next billing amount
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">$150</div>
          </div>
        </div>
        {/* // */}
        <div className="mt-7">
          <div className="flex flex-row justify-between items-center">
            <div className="font-semibold text-[1.1rem]">Plan usage</div>
            <div className="pr-2">
              <button className="text-[0.96rem] hover:text-primary ease duration-100">
                Change plan
              </button>
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
                <div className="text-[0.98rem]">15 / 50</div>
              </div>
              {/* // */}

              <div className="mt-4 pb-1.5">
                <Progress value={(15 / 50) * 100} className="w-full h-3" />
              </div>
            </div>
          </div>
        </div>
        {/* // */}
      </SubscriptionLayout>

      <SubscriptionLayout
        title="Payment details"
        icon={Icons.creditCard}
        button={{ text: 'Edit', Icon: Icons.penSquare, onClick: () => {} }}
      >
        <div className="mt-0">
          <div className="flex flex-col md:flex-row gap-2 md:gap-16 xl:gap-20">
            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Name
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-[0.96rem]">Radim Hofer</div>
            </div>

            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Tax Id
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-[0.96rem]">Tax id 123</div>
            </div>

            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Card brand
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-[0.96rem]">Visa</div>
            </div>
            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Card number
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-[0.96rem]">123</div>
            </div>

            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Expiry date
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-[0.96rem]">2025-01-01</div>
            </div>
          </div>
        </div>
      </SubscriptionLayout>

      <SubscriptionLayout title="Invoices" icon={Icons.receipt}>
        <div>Invoice list here</div>
      </SubscriptionLayout>
    </div>
  )
}

export default SubscriptionOverview
