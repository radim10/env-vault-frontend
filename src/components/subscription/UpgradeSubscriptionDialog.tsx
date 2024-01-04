import DeleteDialog from '../DeleteDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useUpgradeSubscription } from '@/api/mutations/subscription'
import { Button } from '../ui/button'

interface Props {
  workspaceId: string
  opened: boolean
  amountDue: number
  onClose: () => void
  onSuccess: () => void
}

const UpgradeSubscriptionDialog: React.FC<Props> = ({
  workspaceId,
  opened,
  amountDue,
  onClose,
  onSuccess,
}) => {
  const { mutate: upgradeSubscription, isLoading: isUpgrading } = useUpgradeSubscription({
    onSuccess: () => onSuccess(),
  })

  return (
    <>
      <AlertDialog open={opened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade subscription</AlertDialogTitle>
            <AlertDialogDescription className="text-[0.9rem] text-foreground">
              <div>
                You will be charged prorated amount of{' '}
                <b className="text-primary">${amountDue} immediately </b>. This amount is calculated
                based on your current plan usage and remaining current plan usage (after you
                upgrade) in this month.
              </div>
            </AlertDialogDescription>

            {/*   {error && ( */}
            {/*     <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0"> */}
            {/*       <Icons.xCircle className="h-4 w-4" /> */}
            {/*       {secretsErrorMsgFromCode(error?.code) ?? 'Something went wrong'} */}
            {/*     </div> */}
            {/*   )} */}
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={isUpgrading} onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="default"
                className=""
                loading={isUpgrading}
                onClick={() => upgradeSubscription({ workspaceId })}
              >
                Upgrade
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default UpgradeSubscriptionDialog
