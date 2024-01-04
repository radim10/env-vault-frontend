import DeleteDialog from '../DeleteDialog'
import { useCancelSubscription } from '@/api/mutations/subscription'

interface Props {
  workspaceId: string
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const CancelSubscriptionDialog: React.FC<Props> = ({ workspaceId, opened, onClose, onSuccess }) => {
  const { mutate: cancelSubscription, isLoading } = useCancelSubscription({
    onSuccess: () => onSuccess(),
  })

  return (
    <>
      <DeleteDialog
        title="Cancel subscription"
        opened={opened}
        onClose={onClose}
        inProgress={isLoading}
        onConfirm={() => {
          cancelSubscription({ workspaceId })
        }}
        descriptionComponent={
          <div className="text-[0.92rem] text-foreground">
            After current billing cycle ends, your paid subscription will be cancelled. Please note
            that you will have to remove any exceeding workspace members and projects when the
            billing cycle ends.
          </div>
        }
      />
    </>
  )
}

export default CancelSubscriptionDialog
