'use client'

import React, { useState } from 'react'
import TeamsTable from './table/TeamsTable'
import { teamsColumns } from './table/Columns'
import { useQueryClient } from '@tanstack/react-query'
import CreateTeamDrawer from './CreateTeamDrawer'
import { ListTeam } from '@/types/teams'
import { useToast } from '../ui/use-toast'

interface Props {
  workspaceId: string
}

const WorkspaceTeams: React.FC<Props> = ({ workspaceId }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [createdDrawerOpened, setCreatedDrawerOpened] = useState(false)

  const handleNewTeam = (team: ListTeam) => {
    toast({
      title: 'Team has been created',
      variant: 'success',
    })

    setCreatedDrawerOpened(false)
    // TODO: query data
  }

  return (
    <div>
      <CreateTeamDrawer
        workspaceId={workspaceId}
        opened={createdDrawerOpened}
        onClose={() => setCreatedDrawerOpened(false)}
        onCreated={handleNewTeam}
      />
      <TeamsTable
        onCreateTeam={() => setCreatedDrawerOpened(true)}
        workspaceId={workspaceId}
        columns={teamsColumns}
        queryClient={queryClient}
      />
    </div>
  )
}

export default WorkspaceTeams
