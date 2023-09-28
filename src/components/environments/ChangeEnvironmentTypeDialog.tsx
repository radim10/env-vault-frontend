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
import { useUpdateEnvironmentType } from '@/api/mutations/environments'
import { EnvironmentType } from '@/types/environments'
import { Badge } from '../ui/badge'
import clsx from 'clsx'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
  opened: boolean
  type: EnvironmentType
  onClose: () => void
  onSuccess: (type: EnvironmentType) => void
}

const envTypes: EnvironmentType[] = [
  EnvironmentType.DEVELOPMENT,
  EnvironmentType.TESTING,
  EnvironmentType.STAGING,
  EnvironmentType.PRODUCTION,
]

const ChangeEnvironmentTypeDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  envName,
  type,
  opened,
  onClose,
  onSuccess,
}) => {
  const [selectedType, setSelectedType] = useState<EnvironmentType>(type)

  const {
    mutate: updateEnvironmentType,
    isLoading,
    error,
  } = useUpdateEnvironmentType({
    onSuccess: () => {
      onSuccess(selectedType)
    },
  })

  const close = () => {
    if (isLoading) return
    onClose()
  }

  return (
    <>
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
            <DialogTitle>Change environment type</DialogTitle>
            <DialogDescription>
              Environment is used to store secrets (environment variables).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pb-4 mt-2 text-lg">
            <div>
              <Label htmlFor="name" className="text-right pl-1 text-[0.9rem]">
                <span className="font-normal">Environment:</span> {envName}
              </Label>
            </div>
            <div className="flex flex-col gap-2 items-start justify-center">
              <Label htmlFor="type" className="text-right pl-1">
                Type
              </Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as EnvironmentType)}
              >
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
                      <Badge
                        variant="default"
                        className={clsx(['text-[0.725rem] text-gray-200'], {
                          'bg-indigo-600 dark:bg-indigo-800/80 hover:bg-indigo-600 dark:hover:bg-indigo-800/80':
                            type === EnvironmentType.DEVELOPMENT,
                          'bg-blue-600 dark:bg-blue-800/80 hover:bg-blue-600 dark:hover:bg-blue-800/80':
                            type === EnvironmentType.TESTING,
                          'bg-green-600 dark:bg-green-800/80 hover:bg-green-600 dark:hover:bg-green-800/80':
                            type === EnvironmentType.STAGING,
                          'bg-red-600 dark:bg-red-800/80 hover:bg-red-600 dark:hover:bg-red-800/80':
                            type === EnvironmentType.PRODUCTION,
                        })}
                      >
                        {type === EnvironmentType.DEVELOPMENT && 'Development'}
                        {type === EnvironmentType.TESTING && 'Testing'}
                        {type === EnvironmentType.STAGING && 'Staging'}
                        {type === EnvironmentType.PRODUCTION && 'Production'}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              disabled={isLoading || selectedType === type}
              onClick={() => {
                updateEnvironmentType({
                  workspaceId,
                  projectName,
                  envName,
                  data: { type: selectedType as EnvironmentType },
                })
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ChangeEnvironmentTypeDialog
