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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '../icons'
import { Textarea } from '../ui/textarea'
import { useCreateProject } from '@/api/mutations/projects'
import { ListProject, NewProject } from '@/types/projects'
import { useQueryClient } from '@tanstack/react-query'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'
import { useUpdateEffect } from 'react-use'

interface Props {
  workspaceId: string
}

const CreateProject: React.FC<Props> = ({ workspaceId }) => {
  const queryClient = useQueryClient()

  const [opened, setOpened] = useState(false)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')

  const {
    mutate: createProject,
    isLoading,
    error,
    reset,
  } = useCreateProject({
    onSuccess: () => {
      // update cache
      const newProject: ListProject = {
        name,
        createdAt: new Date().toString(),
        description: description?.trim()?.length > 0 ? description : null,
        environmentCount: 0,
      }

      queryClient.setQueryData<ListProject[]>(
        ['projects', workspaceId],
        (oldData: ListProject[] | undefined) => {
          if (oldData) {
            return [newProject, ...oldData]
          } else {
            return [newProject]
          }
        }
      )

      setOpened(false)
    },
  })

  useUpdateEffect(() => {
    if (!opened) {
      setTimeout(() => {
        reset()
      }, 150)
    }
  }, [opened])

  const handleCreateProject = () => {
    const newProject: NewProject = {
      name,
      description: description?.trim()?.length > 0 ? description : undefined,
    }

    createProject({
      workspaceId,
      data: newProject,
    })
  }

  const close = () => {
    if (isLoading) return
    setOpened(false)
  }

  const resetState = () => {
    setName('')
    setDescription('')
  }

  return (
    <div>
      <Dialog
        open={opened}
        onOpenChange={(e) => {
          if (!e) {
            close()
          } else resetState()
        }}
      >
        <DialogTrigger asChild onClick={() => setOpened(true)}>
          <Button size={'sm'}>
            <Icons.plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>Project stores your environments and secrets.</DialogDescription>
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

            <div className="flex flex-col gap-1.5 items-start justify-center">
              <Label htmlFor="description" className="text-right pl-1">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                disabled={isLoading}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
              />
            </div>
            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {projectErrorMsgFromCode(error.code) ?? 'Something went wrong'}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              loading={isLoading}
              disabled={name?.trim().length < 2 || isLoading}
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

export default CreateProject
