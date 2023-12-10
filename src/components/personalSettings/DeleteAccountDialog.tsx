import React, { useState } from 'react'
import DeleteDialog from '../DeleteDialog'
import { Input } from '../ui/input'
import { Icons } from '../icons'
import { useDeleteProject } from '@/api/mutations/projects'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'
import { useUpdateEffect } from 'react-use'

interface Props {
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const DeleteAccountDialog: React.FC<Props> = ({ opened, onClose, onSuccess }) => {
  const [confirmText, setConfirmText] = useState('')

  const {
    mutate: deleteProject,
    isLoading,
    error,
    reset,
  } = useDeleteProject({
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
        opened={opened}
        onClose={onClose}
        inProgress={isLoading}
        disabledConfirm={false}
        title="Delete your account?"
        onConfirm={() => {}}
        description="Permanently delete this account, cannot be undone"
      >
        <div className="flex flex-col gap-2 p0-4 pb-4 mt-2">
          <div className="text-[0.92rem]">
            Type <span className="font-bold text-red-600">Delete account</span> to confirm this
            action.
          </div>

          <Input
            placeholder={'Delete account'}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {projectErrorMsgFromCode(error.code) ?? 'Something went wrong'}
            </div>
          )}
        </div>
      </DeleteDialog>
    </div>
  )
}

export default DeleteAccountDialog
