import { useUpdateEffect } from 'react-use'
import { useDeleteWorkspaceInvitation, useDeleteWorkspaceUser } from '@/api/mutations/users'
import { usersErrorMsgFromCode } from '@/api/requests/users'
import DialogComponent from '../Dialog'
import { WorkspaceInvitation } from '@/types/users'
import UserRoleBadge from './UserRoleBadge'
import { Label } from '../ui/label'

interface Props {
  workspaceId: string
  opened: boolean
  invitation: Pick<WorkspaceInvitation, 'id' | 'role' | 'email'>
  onClose: () => void
  onSuccess: () => void
}

const DeleteWorkspaceInvitationDialog: React.FC<Props> = ({
  workspaceId,
  opened,
  invitation,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: deleteInvitation,
    isLoading,
    error,
    reset,
  } = useDeleteWorkspaceInvitation({
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
      title={'Delete pending invitation'}
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
      descriptionComponent={<span>Are you sure you want to delete this invitation?</span>}
      loading={isLoading}
      onSubmit={() => deleteInvitation({ workspaceId, invitationId: invitation?.id })}
      onClose={onClose}
    >
      <div className="flex flex-col gap-1.5 pb-0 mt-2">
        <div>
          <Label htmlFor="name" className="text-right pl-1 text-[0.9rem]">
            <span className="font-normal">Email:</span> {invitation?.email}
          </Label>
        </div>
        <div className="flex flex-row gap-2 items-start justify-start">
          <div>
            <Label htmlFor="Role" className="text-right pl-1">
              Role:
            </Label>
          </div>
          <UserRoleBadge role={invitation.role} />
        </div>
      </div>
    </DialogComponent>
  )
}

export default DeleteWorkspaceInvitationDialog
