'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import AccessTeams from './teams/AccessTeams'
import AddTeamAccessDrawer from './teams/AddTeamAccessDrawer'
import AccessUsers from './users/AccessUsers'
import { Separator } from '../ui/separator'

interface Props {
  workspaceId: string
  projectName: string
}

const ProjectAccess: React.FC<Props> = ({ projectName, workspaceId }) => {
  const queryClient = useQueryClient()

  return (
    <div className="mt-4 flex flex-col gap-6 px-6 lg:px-10">
      {/* <div className="py-2 pl-4 pr-2 flex items-center justify-between rounded-md border w-full"> */}
      {/*   <div className="dark:text-gray-400 text-gray-700 font-bold">Edit access</div> */}
      {/*   <div> */}
      {/*     <Button variant="default" size={'sm'}> */}
      {/*       Edit user access */}
      {/*     </Button> */}
      {/*   </div> */}
      {/* </div> */}
      {/**/}

      {/* <div>TABLE WITH USERS</div> */}

      <div>
        <AccessUsers workspaceId={workspaceId} projectName={projectName} />
      </div>

      <Separator />

      <div className="">
        <AccessTeams workspaceId={workspaceId} projectName={projectName} />
      </div>
    </div>
  )
}

export default ProjectAccess
