import { useUpdateEffect } from 'react-use'
import DialogComponent from '../Dialog'
import { useUpdateTeamMembers } from '@/api/mutations/teams'
import { teamsErrorMsgFromCode } from '@/api/requests/teams'

interface Props {
  workspaceId: string
  teamId: string
  opened: boolean
  userIds: string[]
  userName?: string
  onClose: () => void
  onSuccess: () => void
}

const DeleteMembersDialog: React.FC<Props> = ({
  workspaceId,
  teamId,
  userIds,
  userName,
  opened,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: deleteUsers,
    isLoading,
    error,
    reset,
  } = useUpdateTeamMembers({
    onSuccess: () => onSuccess(),
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  return (
    <DialogComponent
      opened={opened}
      title={userName ? 'Delete user' : 'Delete users'}
      submit={{
        text: 'Delete',
        disabled: false,
        wFull: true,
        variant: 'destructive',
      }}
      error={
        error
          ? error?.code
            ? teamsErrorMsgFromCode(error.code)
            : 'Something went wrong'
          : undefined
      }
      descriptionComponent={
        <>
          {userName ? (
            <span>
              Are you sure you want to remove <span className="font-bold">{userName}</span> from
              this team?
            </span>
          ) : (
            <span>
              Are you sure you want to remove <span className="font-bold">{userIds?.length}</span>{' '}
              users from this team?
            </span>
          )}
        </>
      }
      loading={isLoading}
      onSubmit={() =>
        deleteUsers({
          workspaceId,
          teamId,
          data: { removed: userIds },
        })
      }
      onClose={onClose}
    />
  )
}

export default DeleteMembersDialog
