'use client'

import dayjs from 'dayjs'
import DangerZone from '../DangerZone'
import { Icons } from '../icons'
import SettingsList from '../SettingsList'
import { useSelectedTeamStore } from '@/stores/selectedTeam'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from 'react'
import UpdateTeamDialog from './UpdateTeamDialog'
import { Team, UpdateTeamData } from '@/types/teams'
import { useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { toast } from '../ui/use-toast'
import DeleteTeamDialog from './DeleteTeamDialog'
import { useRouter } from 'next/navigation'

dayjs.extend(relativeTime)

const TeamSettings = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: selectedTeam, update: updateTeam } = useSelectedTeamStore()
  const [dialog, setDialog] = useState<'edit' | 'delete' | null>(null)

  const selectedTeamKey = () => ['workspace-teams', selectedTeam?.workspaceId, selectedTeam?.id]

  const handleRemovedTeam = () => {
    const key = selectedTeamKey()
    const teamData = queryClient.getQueryData<Team>(key)

    if (teamData) {
      queryClient.setQueryData(key, null)
    }

    const listKey = ['workspace-teams', selectedTeam?.workspaceId]
    const listTeams = queryClient.getQueryData<Team[]>(listKey)

    if (listTeams) {
      const index = listTeams.findIndex((item) => item.id === selectedTeam?.id)

      if (index !== -1) {
        const updatedState = produce(listTeams, (draftData) => {
          draftData.splice(index, 1)
        })

        queryClient.setQueryData(listKey, updatedState)
      }
    }

    toast({
      title: 'Team has been deleted',
      variant: 'success',
    })

    router.push(`/workspace/${selectedTeam?.workspaceId}/users/teams`)
  }

  const handleUpdatedTeam = (change: UpdateTeamData) => {
    const key = selectedTeamKey()
    setDialog(null)

    //
    const teamData = queryClient.getQueryData<Team>(key)

    if (teamData) {
      queryClient.setQueryData(selectedTeamKey(), { ...teamData, change })
    }

    // list teams
    const listKey = ['workspace-teams', selectedTeam?.workspaceId]
    const listTeams = queryClient.getQueryData<Team[]>(listKey)

    if (listTeams) {
      const index = listTeams.findIndex((item) => item.id === selectedTeam?.id)

      if (index !== -1) {
        const updatedState = produce(listTeams, (draftData) => {
          draftData[index] = { ...draftData[index], ...change }
        })

        queryClient.setQueryData(listKey, updatedState)
      }
    }
    // state
    updateTeam(change)

    toast({
      title: 'Team has been updated',
      variant: 'success',
    })
  }

  return (
    <>
      {selectedTeam && (
        <>
          <UpdateTeamDialog
            opened={dialog === 'edit'}
            workspaceId={selectedTeam?.workspaceId}
            teamId={selectedTeam?.id}
            prevName={selectedTeam?.name}
            prevDesciption={selectedTeam?.description ?? ''}
            onSuccess={(updated) => handleUpdatedTeam(updated)}
            onClose={() => setDialog(null)}
          />

          <DeleteTeamDialog
            opened={dialog === 'delete'}
            workspaceId={selectedTeam?.workspaceId}
            team={{
              id: selectedTeam?.id,
              name: selectedTeam?.name,
            }}
            onClose={() => setDialog(null)}
            onSuccess={() => handleRemovedTeam()}
          />
        </>
      )}

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
                onClick: () => setDialog('edit'),
              },
              component: <div className="flex items-center gap-2">{selectedTeam?.name}</div>,
            },

            {
              icon: Icons.penSquare,
              label: 'Description',
              editBtn: {
                disabled: false,
                onClick: () => setDialog('edit'),
              },

              component: selectedTeam?.description === null ? <></> : undefined,

              fullComponent:
                selectedTeam?.description !== null ? <>{selectedTeam?.description}</> : undefined,
            },
          ]}
        />

        <DangerZone
          btn={{
            onClick: () => setDialog('delete'),
            disabled: false,
          }}
          title="Delete team"
          description="Permanently delete this team, cannto be undone"
        />
      </div>
    </>
  )
}

export default TeamSettings
