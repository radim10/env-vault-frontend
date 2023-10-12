import React, { useState } from 'react'
import DeleteDialog from '../DeleteDialog'
import { Input } from '../ui/input'
import { Icons } from '../icons'
import { useDeleteProject } from '@/api/mutations/projects'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'
import { useUpdateEffect } from 'react-use'

interface Props {
  workspaceId: string
  projectName: string
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const DeleteProjectDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  opened,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('')

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
        disabledConfirm={name !== projectName}
        title="Delete this project?"
        onConfirm={() => deleteProject({ workspaceId, name })}
      >
        <div className="flex flex-col gap-4 p0-4 pb-4">
          <div className="text-[0.92rem]">
            Type <span className="font-bold text-red-600">{projectName}</span> to confirm this
            action.
          </div>

          <Input
            placeholder={projectName}
            disabled={isLoading}
            onChange={(e) => setName(e.target.value)}
          />

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {error?.code ? projectErrorMsgFromCode(error.code) : 'Something went wrong'}
            </div>
          )}
        </div>
      </DeleteDialog>
    </div>
  )
}

export default DeleteProjectDialog
