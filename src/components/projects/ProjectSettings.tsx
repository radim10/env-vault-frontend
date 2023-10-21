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
import { Project } from '@/types/projects'
import { toast } from '../ui/use-toast'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  projectName: string
}

const ProjectSettings: React.FC<Props> = ({ workspaceId, projectName }) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [dialog, setDialog] = useState<'rename' | 'delete' | 'lock' | 'changeType' | null>(null)

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

  return (
    <>
      <DeleteProjectDialog
        workspaceId={workspaceId}
        projectName={projectName}
        opened={dialog === 'delete'}
        onClose={closeDialog}
        onSuccess={() => handleRemovedProject()}
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
                  {dayjs().format('YYYY-MM-DD HH:mm')} ({dayjs().fromNow()})
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
              editBtn: {
                disabled: false,
                onClick: () => setDialog('rename'),
              },
              component: <div className="flex items-center gap-2">{projectName}</div>,
            },
            {
              icon: Icons.penSquare,
              label: 'Description',
              editBtn: {
                disabled: false,
                onClick: () => setDialog('changeType'),
              },
              component: <></>,
            },
          ]}
        />

        <DangerZone
          btn={{
            onClick: () => setDialog('delete'),
            disabled: false,
          }}
          title="Delete project"
          description="Permanently delete this project, cannot be undone"
        />
      </div>
    </>
  )
}

export default ProjectSettings
