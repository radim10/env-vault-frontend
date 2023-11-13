'use client'

import AccessTeamsTable from './table/AccessTeamsTable'
import { accessTeamsColumns } from './table/AccessTeamsColumns'
import { selectedProjectStore } from '@/stores/selectedProject'

interface Props {
  workspaceId: string
  projectName: string
}

const AccessTeams: React.FC<Props> = ({ workspaceId, projectName }) => {
  const { getState: getSelectedProjectState } = selectedProjectStore
  // const { getState: getSelectedProjectState } = selectedProjectStore

  return (
    <>
      {/* <TypographyH4>Teams</TypographyH4> */}
      <AccessTeamsTable
        workspaceId={workspaceId}
        projectName={projectName}
        columns={accessTeamsColumns}
        readOnly={!getSelectedProjectState().isOwnerRole()}
      />
    </>
  )
}

export default AccessTeams
