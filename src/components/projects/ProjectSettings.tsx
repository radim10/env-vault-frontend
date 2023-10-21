'use client'

import dayjs from 'dayjs'
import { useState } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Icons } from '../icons'
import SettingsList from '../SettingsList'
import DangerZone from '../DangerZone'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  projectName: string
}

const ProjectSettings: React.FC<Props> = ({ workspaceId, projectName }) => {
  const [dialog, setDialog] = useState<'rename' | 'delete' | 'lock' | 'changeType' | null>(null)

  return (
    <>
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
            onClick: () => { },
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
