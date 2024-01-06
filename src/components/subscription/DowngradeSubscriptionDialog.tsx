import { useDowngradeSubscription } from '@/api/mutations/subscription'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { subscriptionErrorMsgFromCode } from '@/api/requests/subscription'

interface Props {
  workspaceId: string
  onClose: () => void
  onSuccess: () => void
}

const DowngradeSubscriptionDialog: React.FC<Props> = ({ workspaceId, onClose, onSuccess }) => {
  const {
    mutate: downgradeSubscription,
    isLoading,
    error,
  } = useDowngradeSubscription({
    onSuccess: () => onSuccess(),
  })

  return (
    <>
      <div className=" fixed left-[50%] text-start top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
        <div className="text-lg font-semibold">Downgrade subscription</div>
        <div>
          <div className="text-[0.92rem] text-foreground">
            After current billing cycle ends, your paid subscription will be dowgraded to{' '}
            <b>Startup</b> plan. Please note that you will have to remove any exceeding workspace
            members and projects when the billing cycle ends.
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
            <Icons.xCircle className="h-4 w-4" />
            {subscriptionErrorMsgFromCode(error.code)}
          </div>
        )}

        <div className="mt-2 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={() => onClose()} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            loading={isLoading}
            variant="outline"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => downgradeSubscription({ workspaceId })}
          >
            Confirm
          </Button>
        </div>
      </div>
    </>
  )
}

export default DowngradeSubscriptionDialog
