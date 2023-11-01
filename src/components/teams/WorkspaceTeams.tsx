'use client'

import { useGetTeams } from '@/api/queries/teams'
import Link from 'next/link'
import React, { useState } from 'react'
import { Icons } from '../icons'
import TeamsTable from './table/TeamsTable'
import { teamsColumns } from './table/Columns'
import { useQueryClient } from '@tanstack/react-query'
import CreateTeamDrawer from './CreateTeamDrawer'

interface Props {
  workspaceId: string
}

const WorkspaceTeams: React.FC<Props> = ({ workspaceId }) => {
  const queryClient = useQueryClient()
  const [createdDrawerOpened, setCreatedDrawerOpened] = useState(false)

  return (
    <div>
      <CreateTeamDrawer
        workspaceId={workspaceId}
        opened={createdDrawerOpened}
        onClose={() => setCreatedDrawerOpened(false)}
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
