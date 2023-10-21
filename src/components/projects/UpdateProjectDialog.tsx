'use client'

import React, { useState } from 'react'
import { useUpdateEffect } from 'react-use'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '../icons'
import { Textarea } from '../ui/textarea'
import { useUpdateProject } from '@/api/mutations/projects'
import { UpdatedProjectData } from '@/types/projects'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'

interface Props {
  opened: boolean
  workspaceId: string

  prevName: string
  prevDesciption: string

  onSuccess: (updated: UpdatedProjectData) => void
  onClose: () => void
}

const UpdateProjectDialog: React.FC<Props> = ({
  opened,
  workspaceId,
  prevName,
  prevDesciption,
  onSuccess,
  onClose,
}) => {
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')

  const { mutate: updateProject, isLoading, error } = useUpdateProject()

  useUpdateEffect(() => {
    setName(prevName)
    setDescription(prevDesciption)
  }, [opened])

  const handleCreateProject = () => {
    const updatedProject: UpdatedProjectData = {}

    if (name !== prevName) {
      updatedProject.name = name
    }

    if (description !== prevDesciption) {
      if (prevDesciption?.length === 0) {
        if (description?.trim()?.length > 0) {
          updatedProject.description = description
        }
      } else {
        if (description?.trim()?.length > 0) {
          updatedProject.description = description
        } else {
          updatedProject.description = null
        }
      }
    }

    updateProject(
      {
        workspaceId,
        name: prevName,
        data: updatedProject,
      },
      {
        onSuccess: () => onSuccess(updatedProject),
      }
    )
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
          if (!e) {
            close()
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update project</DialogTitle>
            <DialogDescription>Update your project's name or description</DialogDescription>
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
                autoFocus={false}
                placeholder="Project name"
                onChange={(e) => setName(e.target.value?.replace(/[\/\s?]/g, '-'))}
              />
            </div>

            <div className="flex flex-col gap-1.5 items-start justify-center">
              <Label htmlFor="description" className="text-right pl-1">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                disabled={isLoading}
                autoFocus={false}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
              />
            </div>

            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {error?.code ? projectErrorMsgFromCode(error.code) : 'Something went wrong'}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              loading={isLoading}
              disabled={
                name?.trim().length < 2 ||
                isLoading ||
                (name === prevName && prevDesciption === description)
              }
              onClick={() => handleCreateProject()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateProjectDialog
