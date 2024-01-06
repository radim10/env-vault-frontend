import { Icons } from '../icons'
import { Button } from '../ui/button'
import { useUpgradeSubscription } from '@/api/mutations/subscription'
import { subscriptionErrorMsgFromCode } from '@/api/requests/subscription'

interface Props {
  workspaceId: string
  amountDue: number
  onClose: () => void
  onSuccess: () => void
}

const UpgradeSubscriptionDialog: React.FC<Props> = ({
  workspaceId,
  amountDue,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: upgradeSubscription,
    isLoading: isUpgrading,
    error,
  } = useUpgradeSubscription({
    onSuccess: () => onSuccess(),
  })

  return (
    <>
      <div className="fixed left-[50%] text-start top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
        <div className="text-lg font-semibold">Upgrade subscription</div>
        <div>
          <div className="text-[0.92rem] text-foreground">
            You will be charged prorated amount of{' '}
            <b className="text-primary">${amountDue} immediately </b>. This amount is calculated
            based on your current plan usage and remaining current plan usage (after you upgrade) in
            this month.
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
            <Icons.xCircle className="h-4 w-4" />
            {subscriptionErrorMsgFromCode(error.code)}
          </div>
        )}

        <div className="mt-2 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={() => onClose()} disabled={isUpgrading}>
            Cancel
          </Button>
          <Button
            variant="default"
            loading={isUpgrading}
            onClick={() => {
              upgradeSubscription({ workspaceId })
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
      {/* <AlertDialog open={opened}> */}
      {/*   <AlertDialogContent> */}
      {/*     <AlertDialogHeader> */}
      {/*       <AlertDialogTitle>Upgrade subscription</AlertDialogTitle> */}
      {/*       <AlertDialogDescription className="text-[0.9rem] text-foreground"> */}
      {/*         <div> */}
      {/*           You will be charged prorated amount of{' '} */}
      {/*           <b className="text-primary">${amountDue} immediately </b>. This amount is calculated */}
      {/*           based on your current plan usage and remaining current plan usage (after you */}
      {/*           upgrade) in this month. */}
      {/*         </div> */}
      {/*       </AlertDialogDescription> */}
      {/**/}
      {/*     </AlertDialogHeader> */}
      {/*     <AlertDialogFooter className="mt-2"> */}
      {/*       <AlertDialogCancel asChild> */}
      {/*         <Button variant="outline" disabled={isUpgrading} onClick={onClose}> */}
      {/*           Cancel */}
      {/*         </Button> */}
      {/*       </AlertDialogCancel> */}
      {/*       <AlertDialogAction asChild> */}
      {/*         <Button */}
      {/*           variant="default" */}
      {/*           className="" */}
      {/*           loading={isUpgrading} */}
      {/*           onClick={() => upgradeSubscription({ workspaceId })} */}
      {/*         > */}
      {/*           Upgrade */}
      {/*         </Button> */}
      {/*       </AlertDialogAction> */}
      {/*     </AlertDialogFooter> */}
      {/*   </AlertDialogContent> */}
      {/* </AlertDialog> */}
    </>
  )
}

export default UpgradeSubscriptionDialog
