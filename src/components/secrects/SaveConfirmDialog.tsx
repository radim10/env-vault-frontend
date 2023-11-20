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
import { secretsErrorMsgFromCode } from '@/api/requests/projects/environments/secrets'
import { useUpdateEffect } from 'react-use'

interface Props {
  opened: boolean
  workspaceId: string
  projectName: string
  envName: string
  changes: StateSecret[]
  secrets: StateSecret[]
  onClose: () => void
  onSuccess: () => void
}

const SaveConfirmDialog: React.FC<Props> = ({
  workspaceId,
  envName,
  changes,
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
    reset,
  } = useUpdateSecrets({
    onSuccess: () => onSuccess(),
  })

  const handleUpdateSecrets = () => {
    let data: UpdatedSecretsBody = []

    // fix new key: state???
    for (const { key, action, newKey, newValue, newDescription } of changes) {
      const updated: UpdatedSecret = {
        // orig key
        key: action === SecretAction.Created ? undefined : key,
        newKey,
        newValue: !newValue && action === SecretAction.Created ? '' : newValue,
        newDescription:
          action === SecretAction.Deleted
            ? undefined
            : newDescription === ''
            ? null
            : newDescription,
        deleted: action === SecretAction.Deleted ? true : undefined,
        // archived: action === SecretAction.Archived ? true : undefined,
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

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  return (
    <div>
      <AlertDialog open={opened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm save</AlertDialogTitle>
            <AlertDialogDescription>
              {`Do you really want to save ${changes?.length} ${
                changes?.length === 1 ? 'change' : 'changes'
              }?`}
            </AlertDialogDescription>

            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {secretsErrorMsgFromCode(error?.code) ?? 'Something went wrong'}
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
                loading={isLoading}
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
