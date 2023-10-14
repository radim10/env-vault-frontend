import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUpdateEffect } from 'react-use'
import { Icons } from '@/components/icons'
import { useRollbackEnvChange } from '@/api/mutations/envChangelog'
import { envChangelogErrorMsgFromCode } from '@/api/requests/envChangelog'
import { EnvChangelogItem } from '@/types/envChangelog'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
  changeId: string

  opened: boolean

  onClose: () => void
  onSuccess: (item?: EnvChangelogItem) => void
}

const RollbackDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  envName,
  changeId,
  opened,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: rollback,
    isLoading,
    error,
    reset,
  } = useRollbackEnvChange({
    onSuccess,
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  const close = () => {
    if (isLoading) return
    onClose()
  }

  return (
    <div>
      <Dialog
        open={opened}
        onOpenChange={(e) => {
          if (!e) {
            close()
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Revert change</DialogTitle>
            <DialogDescription>Dou you really wany to revert this change?</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {error?.code ? envChangelogErrorMsgFromCode(error?.code) : 'Something went wrong'}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="w-full gap-2"
              loading={isLoading}
              onClick={() => {
                rollback({ workspaceId, projectName, envName, changeId })
              }}
            >
              <Icons.undo className="h-4 w-4" />
              <span>Revert</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RollbackDialog
