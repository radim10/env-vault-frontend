import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { useUpdateEffect } from 'react-use'
import { useRenameEnvironment } from '@/api/mutations/environments'
import { envErrorMsgFromCode } from '@/api/requests/projects/environments/environments'

interface Props {
  projectName: string
  workspaceId: string
  envName: string

  opened: boolean
  onClose: () => void
  onSuccess: (newName: string) => void
}

const RenameEnvironmentDialog: React.FC<Props> = ({
  opened,
  workspaceId,
  envName,
  projectName,
  onClose,
  onSuccess,
}) => {
  const [newName, setName] = useState('')

  useUpdateEffect(() => {
    if (opened && envName !== newName) setName(envName)
  }, [opened])

  const {
    mutate: renameEnvironment,
    isLoading,
    error,
  } = useRenameEnvironment({
    onSuccess: () => onSuccess(newName),
  })

  const handleSubmit = () => {
    renameEnvironment({ workspaceId, envName, projectName, data: { name: newName } })
  }

  const close = () => {
    if (isLoading) return
    onClose()
  }

  return (
    <div>
      <Dialog
        open={opened}
        onOpenChange={(e) => {
          if (!e) close()
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename environment</DialogTitle>
            <DialogDescription className="dark:text-red-600 text-red-500">
              Please note that your deploys may be affcted if you use token alongiside with project
              name.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 text-lg">
            <div className="flex flex-col gap-1.5 items-start justify-center">
              <Label htmlFor="name" className="text-right pl-1">
                New name
              </Label>

              <Input
                id="name"
                value={newName}
                disabled={isLoading}
                placeholder="New project name"
                onChange={(e) =>
                  setName(e.target.value?.replace(/[^a-zA-Z0-9 ]/g, '_').replace(/ /g, '_'))
                }
              />
            </div>

            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 -mt-1">
                <Icons.xCircle className="h-4 w-4" />
                {error?.code ? envErrorMsgFromCode(error?.code) : 'Something went wrong'}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              loading={isLoading}
              disabled={newName?.trim().length < 2 || isLoading || newName === envName}
              onClick={() => handleSubmit()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RenameEnvironmentDialog
