'use client'

import { useState } from 'react'
import Drawer from '@/components/Drawer'
import { ListTeam } from '@/types/teams'
import { useQueryClient } from '@tanstack/react-query'
import TeamsSearchCombobox from '@/components/teams/TeamsSearchCombobox'

interface Props {
  workspaceId: string
  projectName?: string
  opened: boolean
  onAdded?: () => void
  onClose: () => void
}

const AddTeamAccessDrawer: React.FC<Props> = ({ workspaceId, projectName, opened, onClose }) => {
  const queryClient = useQueryClient()
  const isLoading = false

  const [selectedTeams, setSelectedTeams] = useState<ListTeam[]>([])

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
          onSubmit: () => {},
        }}
      >
        <div>
          <TeamsSearchCombobox
            queryClient={queryClient}
            onSelect={(teams) => {
              setSelectedTeams(teams)
            }}
            workspaceId={workspaceId}
            selectedTeams={selectedTeams}
          />
        </div>
      </Drawer>
    </>
  )
}

export default AddTeamAccessDrawer
