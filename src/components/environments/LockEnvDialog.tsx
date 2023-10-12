import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Icons } from '../icons'
import { useLockEnvironment } from '@/api/mutations/environments'
import { envErrorMsgFromCode } from '@/api/requests/projects/environments/environments'
import { useUpdateEffect } from 'react-use'

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
    reset,
  } = useLockEnvironment({
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
            <DialogTitle>{lock ? 'Lock environment' : 'Unlock environment'}</DialogTitle>
            <DialogDescription>
              {lock &&
                `Locking environmnet makes it 'readonly'. Environment cannot be renamed, deleted or
              updated.`}
              {!lock &&
                `Unlocking environmet will allow environmnet to be renamed, deleted or updated.`}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {error?.code ? envErrorMsgFromCode(error?.code) : 'Something went wrong'}
            </div>
          )}

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
