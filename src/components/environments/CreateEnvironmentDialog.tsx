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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icons } from '../icons'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useCreateEnvironment } from '@/api/mutations/environments'
import { EnvironmentType } from '@/types/environments'
import { Badge } from '../ui/badge'
import clsx from 'clsx'
import EnvTypeBadge from './EnvTypeBadge'
import { envErrorMsgFromCode } from '@/api/requests/projects/environments/environments'

interface Props {
  workspaceId: string
  projectName: string
  btnText?: string
  fullBtn?: boolean
  onSuccess: (args: { name: string; type: EnvironmentType }) => void
}

const envTypes: EnvironmentType[] = [
  EnvironmentType.DEVELOPMENT,
  EnvironmentType.TESTING,
  EnvironmentType.STAGING,
  EnvironmentType.PRODUCTION,
]

const CreateEnvironmentDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  btnText,
  fullBtn,
  onSuccess,
}) => {
  const [opened, setOpened] = useState(false)
  const [selectedType, setSelectedType] = useState<EnvironmentType | null>(null)
  const [name, setName] = useState('')

  const {
    mutate: createEnvironment,
    isLoading,
    error,
  } = useCreateEnvironment({
    onSuccess: () => {
      onSuccess({ name: name, type: selectedType as EnvironmentType })
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
          <Button
            className={clsx(['gap-1.5'], {
              'w-full': fullBtn,
            })}
            variant="default"
            size={'sm'}
          >
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
            <div className="flex flex-col gap-2 items-start justify-center">
              <Label htmlFor="type" className="text-right pl-1">
                Type
              </Label>
              <Select onValueChange={(value) => setSelectedType(value as EnvironmentType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {envTypes.map((type) => (
                    <SelectItem
                      value={type}
                      key={type}
                      className="px-10"
                      onFocus={(e) => e.stopPropagation()}
                    >
                      <EnvTypeBadge type={type} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 items-start justify-center">
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

            {error?.code && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 -mt-1">
                <Icons.xCircle className="h-4 w-4" />
                {envErrorMsgFromCode(error?.code)}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              loading={isLoading}
              disabled={name?.trim().length < 2 || isLoading || selectedType === null}
              onClick={() => {
                createEnvironment({
                  workspaceId,
                  projectName,
                  data: { name, type: selectedType as EnvironmentType },
                })
              }}
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
