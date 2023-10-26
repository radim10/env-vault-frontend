'use client'

import { useGetWorkspaceUsers } from '@/api/queries/users'
import { columns } from './table/Columns'
import UsersDataTable from './table/DataTable'

interface Props {
  workspaceId: string
}

const WorkspaceUsers: React.FC<Props> = ({ workspaceId }) => {
  // const { data } = useGetWorkspaceUsers(workspaceId)

  const dummyData =[{"id":"915b7fa0-f194-47cb-8b47-479a4d88f0b4","name":"radim","avatarUrl":"https://avatars.githubusercontent.com/u/62602887?v=4"},{"id":"8afba311-8706-472d-836b-5d62a1eb8e32","name":"John Doe John Doe John Doe John Doe dasdsadasd","avatarUrl":null}] 

  return (
    <div>
      <UsersDataTable columns={columns as any} data={dummyData} />
    </div>
  )
}

export default WorkspaceUsers
