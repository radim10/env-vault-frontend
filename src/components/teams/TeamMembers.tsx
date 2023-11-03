'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import TeamMembersTable from './membersTable/Table'
import { columns } from './membersTable/Columns'

interface Props {
  workspaceId: string
  teamId: string
}

const TeamMembers: React.FC<Props> = ({ workspaceId, teamId }) => {
  const queryClient = useQueryClient()
  const [inviteUserDialog, setInviteUserDialog] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <TeamMembersTable
        workspaceId={workspaceId}
        teamId={teamId}
        queryClient={queryClient}
        columns={columns}
        onInviteUser={() => {}}
      />
    </div>
  )
}

export default TeamMembers
