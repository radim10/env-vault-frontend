'use client'

import { useGetProjectAccessTeams } from '@/api/queries/projectAccess'
import { userTeamsColumns } from '@/components/singleUser/table/UserTeamsColumns'
import AccessTeamsTable from './table/AccessTeamsTable'
import { accessTeamsColumns } from './table/AccessTeamsColumns'
import TypographyH4 from '@/components/typography/TypographyH4'

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
