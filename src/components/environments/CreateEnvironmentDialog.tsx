'use client'

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
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useCreateEnvironment } from '@/api/mutations/environments'

interface Props {
  workspaceId: string
  projectName: string
  btnText?: string
  onSuccess: (name: string) => void
}

const CreateEnvironmentDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  btnText,
  onSuccess,
}) => {
  const [opened, setOpened] = useState(false)
  const [name, setName] = useState('')

  const {
    mutate: createEnvironment,
    isLoading,
    error,
  } = useCreateEnvironment({
    onSuccess: () => {
      onSuccess(name)
      setOpened(false)
    },
  })

  const close = () => {
    if (isLoading) return
    setOpened(false)
  }

  const resetState = () => {
    setName('')
  }

  return (
    <>
      <Dialog
        open={opened}
        onOpenChange={(e) => {
          if (!e) {
            close()
          } else resetState()
        }}
      >
        <DialogTrigger asChild onClick={() => setOpened(true)}>
          <Button className="gap-1.5" variant="default" size={'sm'}>
            <Icons.plus className="h-4 w-4" />
            <span>{btnText ?? 'Add new'}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new environment</DialogTitle>
            <DialogDescription>
              Environment is used to store secrets (environment variables).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 text-lg">
            <div className="flex flex-col gap-1.5 items-start justify-center">
              <Label htmlFor="name" className="text-right pl-1">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                disabled={isLoading}
                placeholder="Project name"
                onChange={(e) => setName(e.target.value?.replace(/[\/\s?]/g, '-'))}
              />
            </div>

            <div className="flex flex-col gap-1.5 items-start justify-center">Type dropdown</div>

            {error?.message && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 -mt-1">
                <Icons.xCircle className="h-4 w-4" />
                {error?.message}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              loading={isLoading}
              disabled={name?.trim().length === 0 || isLoading}
              onClick={() => createEnvironment({ workspaceId, projectName, data: { name } })}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateEnvironmentDialog
