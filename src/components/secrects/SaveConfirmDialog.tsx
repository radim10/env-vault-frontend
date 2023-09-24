import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useUpdateSecrets } from '@/api/mutations/secrets'
import { Button } from '../ui/button'
import { SecretAction, StateSecret } from '@/stores/secrets'
import { UpdatedSecret, UpdatedSecretsBody } from '@/types/secrets'
import { Icons } from '../icons'

interface Props {
  opened: boolean
  workspaceId: string
  projectName: string
  envName: string
  changesCount: number
  secrets: StateSecret[]
  onClose: () => void
  onSuccess: () => void
}

const SaveConfirmDialog: React.FC<Props> = ({
  workspaceId,
  envName,
  changesCount,
  projectName,
  opened,
  secrets,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: updateSecret,
    isLoading,
    error,
  } = useUpdateSecrets({
    onSuccess: () => onSuccess(),
  })

  const handleUpdateSecrets = () => {
    const changes = secrets?.filter((s) => s.action !== null)

    let data: UpdatedSecretsBody = []

    // fix new key: state???
    for (const { key, value, action, updatedKey, updatedValue } of changes) {
      const updated: UpdatedSecret = {
        // orig key
        key: action !== SecretAction.Created ? key : undefined,
        newKey:
          action === SecretAction.Created || (updatedKey && action === SecretAction.Updated)
            ? key
            : undefined,
        newValue:
          action === SecretAction.Created || (updatedValue && action === SecretAction.Updated)
            ? value
            : undefined,
        deleted: action === SecretAction.Deleted,
      }

      data.push(updated)
    }

    updateSecret({
      workspaceId,
      projectName,
      envName,
      data,
    })

    console.log(data)
  }

  return (
    <div>
      <AlertDialog open={opened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm save</AlertDialogTitle>
            <AlertDialogDescription>
              {`Do you really want to save ${changesCount} ${
                changesCount === 1 ? 'change' : 'changes'
              }?`}
            </AlertDialogDescription>

            {error?.message && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 -mt-1">
                <Icons.xCircle className="h-4 w-4" />
                {error?.message === 'Out of sync'
                  ? 'Cannot save because secrets has beenm updated in the meantime'
                  : error.message}
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={isLoading} onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="default"
                className="px-6"
                disabled={isLoading}
                onClick={handleUpdateSecrets}
              >
                Save
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SaveConfirmDialog
