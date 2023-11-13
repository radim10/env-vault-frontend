import { useGetProjectAccessUsers } from '@/api/queries/projectAccess'
import TypographyH4 from '@/components/typography/TypographyH4'
import AccessUsersTable from './table/AccessUsersTable'
import { accessUsersColumns } from './table/AccessUsersColumns'
import { selectedProjectStore } from '@/stores/selectedProject'

interface Props {
  workspaceId: string
  projectName: string
}

const AccessUsers: React.FC<Props> = ({ workspaceId, projectName }) => {
  // const { isOwnerRole, data: envData } = useSelectedProjectStore()
  const { getState: getSelectedProjectState } = selectedProjectStore

  const { data } = useGetProjectAccessUsers({
    workspaceId,
    projectName,
  })

  return (
    <>
      {getSelectedProjectState().data?.userRole}
      {/* <TypographyH4>Users</TypographyH4> */}

      <AccessUsersTable
        workspaceId={workspaceId}
        projectName={projectName}
        columns={accessUsersColumns}
        readOnly={!getSelectedProjectState().isOwnerRole()}
      />
    </>
  )
}

export default AccessUsers
