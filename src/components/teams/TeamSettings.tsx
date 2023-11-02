'use client'

import dayjs from 'dayjs'
import DangerZone from '../DangerZone'
import { Icons } from '../icons'
import SettingsList from '../SettingsList'
import { useSelectedTeamStore } from '@/stores/selectedTeam'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const TeamSettings = () => {
  const { data: selectedTeam } = useSelectedTeamStore()

  return (
    <div className="flex flex-col gap-7">
      <SettingsList
        title="Team settings"
        description={'Edit this team'}
        icon={Icons.settings2}
        items={[
          {
            icon: Icons.clock4,
            label: 'Created at',
            component: (
              <>
                {dayjs(selectedTeam?.createdAt).format('YYYY-MM-DD HH:mm')} (
                {dayjs(selectedTeam?.createdAt).fromNow()})
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
              onClick: () => {},
            },
            component: <div className="flex items-center gap-2">"NAME"</div>,
          },

          {
            icon: Icons.penSquare,
            label: 'Description',
            editBtn: {
              disabled: false,
              onClick: () => {},
            },

            component: selectedTeam?.description === null ? <></> : undefined,

            fullComponent:
              selectedTeam?.description !== null ? <>{selectedTeam?.description}</> : undefined,
          },
        ]}
      />

      <DangerZone
        btn={{
          onClick: () => {},
          disabled: true,
        }}
        title="Delete team"
        description="Permanently delete this team, cannto be undone"
      />
    </div>
  )
}

export default TeamSettings
