import React, { useState } from 'react'
import DeleteDialog from '../DeleteDialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Icons } from '../icons'
import { useDeleteProject } from '@/api/mutations/projects'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'

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
  } = useDeleteProject({
    onSuccess: () => onSuccess(),
  })

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

          {error?.code && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 -mt-1">
              <Icons.xCircle className="h-4 w-4" />
              {projectErrorMsgFromCode(error.code)}
            </div>
          )}
        </div>
      </DeleteDialog>
    </div>
  )
}

export default DeleteProjectDialog
