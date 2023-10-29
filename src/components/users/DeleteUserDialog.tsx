import { useUpdateEffect } from 'react-use'
import { useDeleteWorkspaceUser } from '@/api/mutations/users'
import { usersErrorMsgFromCode } from '@/api/requests/users'
import DialogComponent from '../Dialog'

interface Props {
  workspaceId: string
  opened: boolean
  user: {
    name: string
    id: string
  }
  onClose: () => void
  onSuccess: () => void
}

const DeleteWorkspaceUserDialog: React.FC<Props> = ({
  workspaceId,
  user,
  opened,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: deleteUser,
    isLoading,
    error,
    reset,
  } = useDeleteWorkspaceUser({
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
      title={'Delete user'}
      submit={{
        text: 'Delete',
        disabled: false,
        wFull: true,
        variant: 'destructive',
      }}
      error={
        error
          ? error?.code
            ? usersErrorMsgFromCode(error.code)
            : 'Something went wrong'
          : undefined
      }
      descriptionComponent={
        <span>
          Are you sure you want to delete user <span className="font-bold">{user?.name}</span> from
          this workspace?
        </span>
      }
      loading={isLoading}
      onSubmit={() => deleteUser({ workspaceId, userId: user?.id })}
      onClose={onClose}
    />
  )
}

export default DeleteWorkspaceUserDialog
