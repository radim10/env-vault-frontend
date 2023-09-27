'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteProjectDialog from '@/components/projects/DeleteProjectDialog'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import clsx from 'clsx'
import { Icons } from '../icons'
import { useGetProject } from '@/api/queries/projects/root'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { ListProject, UpdatedProjectData } from '@/types/projects'
import UpdateProjectDialog from './UpdateProjectDialog'
import { EnvironmentList } from '../environments/EnvironmentList'
import CreateEnvironmentDialog from '../environments/CreateEnvironmentDialog'

const dropdownItems = [
  { label: 'Rename', icon: Icons.pencil },
  { label: 'Webhooks', icon: Icons.webhook },
  { label: 'Delete', icon: Icons.trash },
]

interface Props {
  workspaceId: string
  projectName: string
}

const ProjectRoot: React.FC<Props> = ({ workspaceId, projectName }) => {
  const router = useRouter()
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false)
  const [updateDialogOpened, setUpdateDialogOpened] = useState(false)

  const {
    data: project,
    isLoading,
    isError,
  } = useGetProject(
    {
      workspaceId,
      projectName,
    },
    {
      enabled: queryClient.getQueryData(['project', workspaceId, projectName]) !== null,
    }
  )

  if (isLoading) {
    return 'loading'
  }

  if (isError) {
    return 'error'
  }

  if (project === null) {
    return 'Project deleted'
  }

  const handleRemovedProject = () => {
    // selected
    queryClient.setQueryData(['project', workspaceId, projectName], null)

    // list
    queryClient.setQueryData<ListProject[]>(
      ['projects', workspaceId],
      (oldData: ListProject[] | undefined) => {
        if (oldData) {
          return oldData.filter((item) => item.name !== projectName)
        } else {
          return []
        }
      }
    )

    toast({
      title: 'Project has been deleted',
      variant: 'success',
    })

    router.push(`/workspace/${workspaceId}/projects`)
  }

  const handleUpdatedProject = (updated: UpdatedProjectData) => {
    setUpdateDialogOpened(false)

    queryClient.setQueryData(['project', workspaceId, projectName], {
      ...project,
      ...updated,
    })

    // list
    const listProjects = queryClient.getQueryData<ListProject[]>(['projects', workspaceId])

    if (listProjects) {
      const index = listProjects.findIndex((item) => item.name === projectName)

      if (index) {
        const updated = listProjects?.[index]
        queryClient.setQueryData(['projects', workspaceId], updated)
      }
    }

    toast({
      title: 'Project has been updated',
      variant: 'success',
    })

    if (updated?.name) {
      router.push(`/workspace/${workspaceId}/projects/${updated.name}`)
    }
  }

  return (
    <div>
      {project && (
        <>
          <DeleteProjectDialog
            workspaceId={workspaceId}
            projectName={project?.name}
            opened={deleteDialogOpened}
            onClose={() => setDeleteDialogOpened(false)}
            onSuccess={() => handleRemovedProject()}
          />
          <UpdateProjectDialog
            opened={updateDialogOpened}
            prevDesciption={project?.description ?? ''}
            prevName={project?.name}
            workspaceId={workspaceId}
            onClose={() => setUpdateDialogOpened(false)}
            onSuccess={handleUpdatedProject}
          />
        </>
      )}
      <div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Link
              href={`/workspace/${workspaceId}/projects`}
              className="text-primary hover:text-primary hover:underline underline-offset-4 underline-offset-[6px] hover:decoration-2"
            >
              <div className="font-semibold text-2xl">Projects</div>
            </Link>
            {/* // */}
            <div className="dark:text-gray-400">
              <Icons.chevronRight className="mt-1" />
            </div>
            <div className="font-semibold text-2xl ">{project.name}</div>
          </div>
          {/* // FLEX END */}
          <div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={'outline'} size={'icon'}>
                    <Icons.moreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-10 w-[200px] py-1">
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem
                      onClick={() => {
                        if (item.label === 'Delete') {
                          setDeleteDialogOpened(true)
                        } else if (item.label === 'Rename') {
                          setUpdateDialogOpened(true)
                        }
                      }}
                      className={clsx(['flex items-center gap-3 px-3.5 py-2'], {
                        'text-red-500 dark:hover:text-red-500 hover:text-red-500':
                          item.label === 'Delete',
                      })}
                    >
                      <item.icon className={clsx(['h-4 w-4 opacity-70'])} />
                      <div className="">{item.label}</div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="mt-8">
        <EnvironmentList
          workspaceId={workspaceId}
          projectName={project?.name}
          values={project?.environments}
          queryClient={queryClient}
        />
      </div>
    </div>
  )
}

export default ProjectRoot
