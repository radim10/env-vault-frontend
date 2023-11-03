'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import TeamMembersTable from './membersTable/Table'
import { columns } from './membersTable/Columns'
import CreateTeamDrawer from './CreateTeamDrawer'
import { useToast } from '../ui/use-toast'

interface Props {
  workspaceId: string
  teamId: string
}

const TeamMembers: React.FC<Props> = ({ workspaceId, teamId }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [addMembersDrawerOpened, setAddMembersDrawerOpened] = useState(false)

  const handleAddedMembers = () => {
    queryClient.invalidateQueries(['workspace', workspaceId, 'team-members', teamId], {
      exact: false,
    })

    toast({
      title: 'Team members have been added',
      variant: 'success',
    })

    setAddMembersDrawerOpened(false)
  }

  return (
    <>
      <CreateTeamDrawer
        queryClient={queryClient}
        teamId={teamId}
        workspaceId={workspaceId}
        opened={addMembersDrawerOpened}
        onClose={() => setAddMembersDrawerOpened(false)}
        onCreated={() => {}}
        onAddedMembers={handleAddedMembers}
      />
      <div className="flex flex-col gap-6">
        <TeamMembersTable
          workspaceId={workspaceId}
          teamId={teamId}
          queryClient={queryClient}
          columns={columns}
          onAddMembers={() => setAddMembersDrawerOpened(true)}
        />
      </div>
    </>
  )
}

export default TeamMembers
