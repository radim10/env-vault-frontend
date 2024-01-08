'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/icons'
import TypographyH2 from '../typography/TypographyH2'
import { SubscriptionPlan, subscriptionPlanToString } from '@/types/subscription'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '../ui/button'

interface Props {
  workspaceId: string
  plan: SubscriptionPlan
}

const SubscriptionSuccess: React.FC<Props> = ({ plan, workspaceId }) => {
  const router = useRouter()
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Card className="sm:w-[490px] w-[90vw]">
        <CardContent>
          <div className="pb-2 pt-9">
            <div className="flex flex-col gap-3 justify-center items-center ">
              <div>
                <Icons.partyPopper className="w-12 h-12 text-yellow-500" />
              </div>
              <div className="flex flex-col gap-8 items-center mt-3">
                <div className="flex flex-col items-center gap-2.5">
                  <TypographyH2>Payment has been successful</TypographyH2>
                  <div className="text-md text-center text-foreground">
                    Subscription plan{' '}
                    <span
                      className={clsx({
                        'text-blue-600 dark:text-blue-500': plan === SubscriptionPlan.STARTUP,
                        'text-green-600 dark:text-green-600': plan === SubscriptionPlan.BUSINESS,
                      })}
                    >
                      {subscriptionPlanToString(plan)}
                    </span>{' '}
                    has been activated. Lets get securely running more awesome apps.
                  </div>
                </div>
                <div className="">
                  <Button
                    onClick={() => {
                      router.replace(`/workspace/${workspaceId}/projects`)
                    }}
                  >
                    Back to dahboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <div className="flex flex-col gap-3 justify-center items-center -mt-1 shadow-lg px-8 lg:px-12 pb-10 rounded-xl"> */}
      {/*   <div className="">Success</div> */}
      {/*   <div className="flex flex-col gap-8 items-center"> */}
      {/*     <div className="flex flex-col items-center gap-0.5"> */}
      {/*       <TypographyH2>Payment has been succesful</TypographyH2> */}
      {/*       <div className="text-md text-center"> */}
      {/*         Your subscription plan {plan} has been activated */}
      {/*       </div> */}
      {/*     </div> */}
      {/*     <div className="">Back btn</div> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  )
}

export default SubscriptionSuccess
