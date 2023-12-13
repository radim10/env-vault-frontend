import { Icons } from '../icons'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import DeleteDialog from '../DeleteDialog'
import { useUpdateEffect } from 'react-use'
import { useDeleteAccount } from '@/api/mutations/currentUser'
import { currentUserErrorMsgFromCode } from '@/api/requests/currentUser'
import clsx from 'clsx'
import { useLeaveWorkspace } from '@/api/mutations/workspaces'
import { workspacesErrorMsgFromCode } from '@/api/requests/workspaces'

interface Props {
  workspaceId: string
  workspaceName: string
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const LeaveWorkspaceDialog: React.FC<Props> = ({
  workspaceId,
  workspaceName,
  opened,
  onClose,
  onSuccess,
}) => {
  const [confirmText, setConfirmText] = useState('')

  const {
    mutate: leaveWorkspace,
    isLoading,
    error,
    reset,
  } = useLeaveWorkspace({
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
        title="Leave workspace"
        onConfirm={() => leaveWorkspace({ workspaceId })}
        descriptionComponent={
          <>
            <span className="text-red-600">
              If there are no more workspace users, the workspace will be deleted.
            </span>
            <span> Are you sure you want to leave this workspace?</span>
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
              placeholder={'Leave workspace'}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {workspacesErrorMsgFromCode(error.code)}
            </div>
          )}
        </div>
      </DeleteDialog>
    </div>
  )
}

export default LeaveWorkspaceDialog
