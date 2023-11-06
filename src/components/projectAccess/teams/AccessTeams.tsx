'use client'

import AccessTeamsTable from './table/AccessTeamsTable'
import { accessTeamsColumns } from './table/AccessTeamsColumns'

interface Props {
  workspaceId: string
  projectName: string
}

const AccessTeams: React.FC<Props> = ({ workspaceId, projectName }) => {
  return (
    <>
      {/* <TypographyH4>Teams</TypographyH4> */}
      <AccessTeamsTable
        workspaceId={workspaceId}
        projectName={projectName}
        columns={accessTeamsColumns}
      />
    </>
  )
}

export default AccessTeams
