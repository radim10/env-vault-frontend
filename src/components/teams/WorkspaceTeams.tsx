'use client'

import { useState } from 'react'
import { produce } from 'immer'
import TeamsTable from './table/TeamsTable'
import { useQueryClient } from '@tanstack/react-query'
import CreateTeamDrawer from './CreateTeamDrawer'
import { ListTeam } from '@/types/teams'
import { useToast } from '../ui/use-toast'
import useTeamsTableColumns from './table/Columns'
import useCurrentUserStore from '@/stores/user'

interface Props {
  workspaceId: string
}

const WorkspaceTeams: React.FC<Props> = ({ workspaceId }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { isMemberRole } = useCurrentUserStore()
  const [createdDrawerOpened, setCreatedDrawerOpened] = useState(false)
  const [newTeam, setNewTeam] = useState<ListTeam | undefined>()

  const handleNewTeam = (team: ListTeam) => {
    toast({
      title: 'Team has been created',
      variant: 'success',
    })

    setCreatedDrawerOpened(false)
    setNewTeam(team)

    setTimeout(() => {
      setNewTeam(undefined)
    }, 500)

    // TODO:  query data (sorting issue)
    // const existingTeams = queryClient.getQueryData<ListTeam[]>(['workspace-teams', workspaceId])
    //
    // if (existingTeams) {
    //   const updatedTeams = produce(existingTeams, (draftData) => {
    //     draftData.unshift(team)
    //   })
    //
    //   queryClient.setQueryData(['workspace-teams', workspaceId], updatedTeams)
    // }
  }

  return (
    <div>
      {!isMemberRole() && (
        <CreateTeamDrawer
          queryClient={queryClient}
          workspaceId={workspaceId}
          opened={createdDrawerOpened}
          onClose={() => setCreatedDrawerOpened(false)}
          onCreated={handleNewTeam}
        />
      )}

      <TeamsTable
        onCreateTeam={isMemberRole() ? undefined : () => setCreatedDrawerOpened(true)}
        newTeam={newTeam}
        workspaceId={workspaceId}
        columns={useTeamsTableColumns()}
        queryClient={queryClient}
      />
    </div>
  )
}

export default WorkspaceTeams
