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
import { Button } from '../ui/button'
import { useRenewSubscription, useUndoDowngradeSubscription } from '@/api/mutations/subscription'
import dayjs from 'dayjs'

interface Props {
  workspaceId: string
  opened: boolean
  cancelAt: string
  onClose: () => void
  onSuccess: () => void
}

const UndoDowngradeSubscriptionDialog: React.FC<Props> = ({
  workspaceId,
  cancelAt,
  opened,
  onClose,
  onSuccess,
}) => {
  const { mutate: undoDowngrade, isLoading } = useUndoDowngradeSubscription({
    onSuccess,
  })

  return (
    <>
      <AlertDialog open={opened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Undo downgrade</AlertDialogTitle>
            <AlertDialogDescription className="text-[0.92rem] text-foreground">
              <div>
                Currently active subscription will be downgraded to plan Startup on{' '}
                <b>{dayjs(cancelAt).format('DD-MM-YYYY')}. </b>
              </div>
              {`Do you want to undo the downgrade?`}
            </AlertDialogDescription>

            {/*   {error && ( */}
            {/*     <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0"> */}
            {/*       <Icons.xCircle className="h-4 w-4" /> */}
            {/*       {secretsErrorMsgFromCode(error?.code) ?? 'Something went wrong'} */}
            {/*     </div> */}
            {/*   )} */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={isLoading} onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="default"
                className="px-6"
                loading={isLoading}
                onClick={() => undoDowngrade({ workspaceId })}
              >
                Confirm
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default UndoDowngradeSubscriptionDialog
