import { Icons } from '../icons'
import DeleteDialog from '../DeleteDialog'
import { useRevokeUserSession } from '@/api/mutations/userAuth'
import { userAuthErrorMsgFromCode } from '@/api/requests/userAuth'

interface Props {
  sessionId: string
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const RevokeSessionDialog: React.FC<Props> = ({ sessionId, opened, onClose, onSuccess }) => {
  const {
    mutate: revokeSession,
    isLoading,
    error,
  } = useRevokeUserSession({
    onSuccess,
  })

  return (
    <>
      <DeleteDialog
        title="Revoke Session"
        description="Are you sure you want to revoke this session?"
        opened={opened}
        onClose={onClose}
        inProgress={isLoading}
        onConfirm={() => revokeSession({ sessionId })}
      >
        {error && (
          <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
            <Icons.xCircle className="h-4 w-4" />
            {userAuthErrorMsgFromCode(error?.code) ?? 'Something went wrong'}
          </div>
        )}
      </DeleteDialog>
    </>
  )
}

export default RevokeSessionDialog
