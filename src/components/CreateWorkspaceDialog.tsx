import { useState } from 'react'
import DialogComponent from './Dialog'
import { Input } from './ui/input'
import { useCreateWorkspace } from '@/api/mutations/workspaces'

interface Props {
  opened: boolean
  onSuccess: (workspace: { id: string; name: string }) => void
  onClose: () => void
}

const CreateWorkspaceDialog: React.FC<Props> = ({ opened, onSuccess, onClose }) => {
  const [name, setName] = useState('')

  const {
    isLoading,
    error,
    mutate: createWorkspace,
  } = useCreateWorkspace({
    onSuccess: ({ id }) => onSuccess({ id, name }),
  })

  return (
    <DialogComponent
      opened={opened}
      title="Create workspace"
      error={error ? 'Something went wrong' : undefined}
      description="Each workspace has own users and projects and billing."
      loading={isLoading}
      onClose={onClose}
      onSubmit={() => createWorkspace({ name })}
      submit={{
        text: 'Create',
        disabled: name?.trim()?.length === 0,
      }}
    >
      <Input
        value={name}
        disabled={isLoading}
        placeholder="Enter workspace name"
        onChange={(e) => setName(e.target.value)}
      />
    </DialogComponent>
  )
}

export default CreateWorkspaceDialog
