'use client'

import dayjs from 'dayjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Icons } from '../icons'
import SettingsList from '../SettingsList'
import DangerZone from '../DangerZone'
import DeleteProjectDialog from './DeleteProjectDialog'
import { useQueryClient } from '@tanstack/react-query'
import { ListProject, Project, UpdatedProjectData } from '@/types/projects'
import { toast } from '../ui/use-toast'
import UpdateProjectDialog from './UpdateProjectDialog'
import { useSelectedProjectStore } from '@/stores/selectedProject'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  projectName: string
}

const ProjectSettings: React.FC<Props> = ({ workspaceId, projectName }) => {
  const { data: projectState } = useSelectedProjectStore()

  const queryClient = useQueryClient()
  const router = useRouter()
  const [dialog, setDialog] = useState<'edit' | 'delete' | null>(null)

  const closeDialog = () => {
    setDialog(null)
  }

  const handleRemovedProject = () => {
    setDialog(null)

    const projectData = queryClient.getQueryData<Project>(['project', workspaceId, projectName])
    // update project list

    if (projectData) {
      queryClient.setQueryData(['project', workspaceId, projectName], null)
    }

    const projects = queryClient.getQueryData<Project[]>(['projects', workspaceId])

    if (projects) {
      queryClient.setQueryData(
        ['projects', workspaceId],
        projects.filter((item) => item.name !== projectName)
      )
    }

    toast({
      title: 'Project has been deleted',
      variant: 'success',
    })

    router.push(`/workspace/${workspaceId}/projects`)
  }

  const handleUpdatedProject = (updated: UpdatedProjectData) => {
    setDialog(null)

    const projectData = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (projectData) {
      queryClient.setQueryData(['project', workspaceId, projectName], {
        ...projectData,
        ...updated,
      })
    }
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
    <>
      <DeleteProjectDialog
        opened={dialog === 'delete'}
        workspaceId={workspaceId}
        projectName={projectName}
        onClose={closeDialog}
        onSuccess={() => handleRemovedProject()}
      />

      <UpdateProjectDialog
        opened={dialog === 'edit'}
        prevDesciption={
          queryClient.getQueryData<Project>(['project', workspaceId, projectName])?.description ??
          ''
        }
        prevName={projectName}
        workspaceId={workspaceId}
        onClose={closeDialog}
        onSuccess={handleUpdatedProject}
      />

      {/* */}

      <div className="flex flex-col gap-7">
        <SettingsList
          title="General settings"
          description={'Edit this project'}
          icon={Icons.settings2}
          items={[
            {
              icon: Icons.clock4,
              label: 'Created at',
              component: (
                <>
                  {dayjs(
                    queryClient.getQueryData<Project>(['project', workspaceId, projectName])
                      ?.createdAt
                  ).format('YYYY-MM-DD HH:mm')}{' '}
                  (
                  {dayjs(
                    queryClient.getQueryData<Project>(['project', workspaceId, projectName])
                      ?.createdAt
                  ).fromNow()}
                  )
                </>
              ),
            },
            {
              icon: Icons.user,
              label: 'Created by',
              value: '@dimak00',
            },
            {
              icon: Icons.fileText,
              label: 'Name',
              editBtn:
                projectState?.userRole === 'OWNER'
                  ? {
                      disabled: false,
                      onClick: () => setDialog('edit'),
                    }
                  : undefined,
              component: <div className="flex items-center gap-2">{projectName}</div>,
            },
            {
              icon: Icons.penSquare,
              label: 'Description',
              editBtn:
                projectState?.userRole === 'OWNER'
                  ? {
                      disabled: false,
                      onClick: () => setDialog('edit'),
                    }
                  : undefined,

              component: projectState?.description === null ? <></> : undefined,

              fullComponent:
                projectState?.description !== null ? <>{projectState?.description}</> : undefined,
            },
          ]}
        />

        {projectState?.userRole === 'OWNER' && (
          <DangerZone
            btn={{
              onClick: () => setDialog('delete'),
              disabled: false,
            }}
            title="Delete project"
            description="Permanently delete this project, cannot be undone"
          />
        )}
      </div>
    </>
  )
}

export default ProjectSettings
