'use client'

import { useState } from 'react'
import Drawer from '@/components/Drawer'
import { ListTeam } from '@/types/teams'
import { useQueryClient } from '@tanstack/react-query'
import TeamsSearchCombobox from '@/components/teams/TeamsSearchCombobox'
import { useUpdateProjectAccessTeams } from '@/api/mutations/projectAccess'
import { UpdateProjectAccessTeamsData } from '@/api/requests/projectAccess'

interface Props {
  workspaceId: string
  projectName: string
  opened: boolean
  onAdded: (teams: ListTeam[]) => void
  onClose: () => void
}

const AddTeamAccessDrawer: React.FC<Props> = ({
  workspaceId,
  projectName,
  opened,
  onAdded,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const [selectedTeams, setSelectedTeams] = useState<ListTeam[]>([])

  const { mutate, isLoading, error } = useUpdateProjectAccessTeams({
    onSuccess: () => {
      onAdded(selectedTeams)
    },
  })

  return (
    <>
      <Drawer
        opened={opened}
        title="Add team access"
        description="Add access to this project for selected teams"
        onClose={onClose}
        submit={{
          text: 'Confirm',
          disabled: selectedTeams.length === 0,
          loading: isLoading,
          onSubmit: () => {
            const teamIds = selectedTeams.map((team) => team.id)
            const payload: UpdateProjectAccessTeamsData = {
              add: teamIds,
            }

            mutate({
              workspaceId,
              projectName,
              data: payload,
            })
          },
        }}
      >
        <div>
          <TeamsSearchCombobox
            queryClient={queryClient}
            onSelect={(teams) => {
              setSelectedTeams(teams)
            }}
            workspaceId={workspaceId}
            project={projectName}
            selectedTeams={selectedTeams}
          />
        </div>
      </Drawer>
    </>
  )
}

export default AddTeamAccessDrawer
