import { Icons } from '../icons'
import { useState } from 'react'
import { Input } from '../ui/input'
import DeleteDialog from '../DeleteDialog'
import { useUpdateEffect } from 'react-use'
import { useDeleteWorkspace } from '@/api/mutations/workspaces'

interface Props {
  workspaceId: string
  workspaceName: string
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const DeleteWorkspaceDialog: React.FC<Props> = ({
  workspaceId,
  workspaceName,
  opened,
  onClose,
  onSuccess,
}) => {
  const [confirmText, setConfirmText] = useState('')

  const {
    mutate: deleteWorkspace,
    isLoading,
    error,
    reset,
  } = useDeleteWorkspace({
    onSuccess: () => onSuccess(),
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  return (
    <div>
      <DeleteDialog
        icon={Icons.logOut}
        opened={opened}
        onClose={onClose}
        inProgress={isLoading}
        hideFooter={false}
        disabledConfirm={confirmText !== workspaceName}
        title="Delete workspace"
        onConfirm={() => deleteWorkspace({ workspaceId })}
        descriptionComponent={
          <>
            <span className="text-red-600">
              Are you sure you want delete leave this workspace? This will permanently ndelete all
              data in this workspace.
            </span>
          </>
        }
      >
        <div className="flex flex-col gap-2 p0-4 pb-2 mt-4">
          <div className="flex flex-col gap-2">
            <div className="text-[0.92rem]">
              Type <span className="font-bold text-red-600">{workspaceName}</span> to confirm this
              action.
            </div>

            <Input
              value={confirmText}
              disabled={isLoading}
              placeholder={workspaceName}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
        </div>
      </DeleteDialog>
    </div>
  )
}

export default DeleteWorkspaceDialog
