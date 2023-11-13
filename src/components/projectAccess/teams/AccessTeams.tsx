'use client'

import useProjectAccessTeamsColums from './table/AccessTeamsColumns'
import AccessTeamsTable from './table/AccessTeamsTable'
import { useSelectedProjectStore } from '@/stores/selectedProject'

interface Props {
  workspaceId: string
  projectName: string
}

const AccessTeams: React.FC<Props> = ({ workspaceId, projectName }) => {
  const { isOwnerRole } = useSelectedProjectStore()

  return (
    <>
      {/* <TypographyH4>Teams</TypographyH4> */}
      <AccessTeamsTable
        workspaceId={workspaceId}
        projectName={projectName}
        columns={useProjectAccessTeamsColums()}
        readOnly={!isOwnerRole()}
      />
    </>
  )
}

export default AccessTeams
