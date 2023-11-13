import AccessUsersTable from './table/AccessUsersTable'
import { useSelectedProjectStore } from '@/stores/selectedProject'
import useProjectAccessUsersColums from './table/AccessUsersColumns'

interface Props {
  workspaceId: string
  projectName: string
}

const AccessUsers: React.FC<Props> = ({ workspaceId, projectName }) => {
  const { isOwnerRole } = useSelectedProjectStore()

  return (
    <>
      <AccessUsersTable
        workspaceId={workspaceId}
        projectName={projectName}
        columns={useProjectAccessUsersColums()}
        readOnly={!isOwnerRole()}
      />
    </>
  )
}

export default AccessUsers
