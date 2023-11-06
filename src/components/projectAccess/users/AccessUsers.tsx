import { useGetProjectAccessUsers } from '@/api/queries/projectAccess'
import TypographyH4 from '@/components/typography/TypographyH4'
import AccessUsersTable from './table/AccessUsersTable'
import { accessUsersColumns } from './table/AccessUsersColumns'

interface Props {
  workspaceId: string
  projectName: string
}

const AccessUsers: React.FC<Props> = ({ workspaceId, projectName }) => {
  const { data } = useGetProjectAccessUsers({
    workspaceId,
    projectName,
  })
  return (
    <>
      {/* <TypographyH4>Users</TypographyH4> */}

      <AccessUsersTable
        workspaceId={workspaceId}
        projectName={projectName}
        columns={accessUsersColumns}
      />
    </>
  )
}

export default AccessUsers
