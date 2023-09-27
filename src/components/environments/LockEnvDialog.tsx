import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Icons } from '../icons'
import { useLockEnvironment } from '@/api/mutations/environments'

interface Props {
  workspaceId: string
  projectName: string
  envName: string

  opened: boolean
  lock: boolean

  onClose: () => void
  onSuccess: () => void
}

 const LockEnvDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  envName,
  opened,
  lock,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: lockEnvironment,
    isLoading,
    error,
  } = useLockEnvironment({
    onSuccess,
  })

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
            <DialogTitle>{lock ? 'Lock environment' : 'Unlock environment'}</DialogTitle>
            <DialogDescription>
              {lock &&
                `Locking environmnet makes it 'readonly'. Environmnet cannot be renamed, deleted or
              updated.`}
              {!lock &&
                `Unlocking environmnet will allow environmnet to be renamed, deleted or updated.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="w-full gap-2"
              loading={isLoading}
              onClick={() => {
                lockEnvironment({ workspaceId, projectName, envName, lock })
              }}
            >
              {lock === true ? (
                <>
                  <Icons.lock className="h-4 w-4" />
                  <span>Lock</span>
                </>
              ) : (
                <>
                  <Icons.unlock className="h-4 w-4" />
                  <span>Unlock</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LockEnvDialog
