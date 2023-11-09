import { teamProjectsColumns } from './projectsTable/TeamProjectsColumns'
import TeamProjectsTable from './projectsTable/TeamProjectsTable'

interface Props {
  workspaceId: string
  teamId: string
}

const TeamAccess: React.FC<Props> = ({ workspaceId, teamId }) => {
  return (
    <>
      <TeamProjectsTable workspaceId={workspaceId} teamId={teamId} columns={teamProjectsColumns} />
    </>
  )
}

export default TeamAccess
