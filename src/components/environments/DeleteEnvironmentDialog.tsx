import React, { useState } from 'react'
import DeleteDialog from '../DeleteDialog'
import { Input } from '../ui/input'
import { Icons } from '../icons'
import { useDeleteProject } from '@/api/mutations/projects'
import { useDeleteEnvironment } from '@/api/mutations/environments'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const DeleteEnvironmentDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  envName,
  opened,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('')

  const {
    mutate: deleteEnvironment,
    isLoading,
    error,
  } = useDeleteEnvironment({
    onSuccess: () => onSuccess(),
  })

  return (
    <div>
      <DeleteDialog
        opened={opened}
        onClose={onClose}
        inProgress={isLoading}
        disabledConfirm={name !== envName}
        title="Delete this environment?"
        onConfirm={() => deleteEnvironment({ workspaceId, projectName, envName })}
      >
        <div className="flex flex-col gap-4 p0-4 pb-4">
          <div className="text-[0.92rem]">
            Type <span className="font-bold text-red-600">{envName}</span> to confirm this action.
          </div>

          <Input
            placeholder={envName}
            disabled={isLoading}
            onChange={(e) =>
              setName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, '-').replace(/ /g, '-'))
            }
          />

          {error?.message && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 -mt-1">
              <Icons.xCircle className="h-4 w-4" />
              {error?.message}
            </div>
          )}
        </div>
      </DeleteDialog>
    </div>
  )
}

export default DeleteEnvironmentDialog
