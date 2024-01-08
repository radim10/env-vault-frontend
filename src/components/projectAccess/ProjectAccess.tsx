'use client'

import AccessTeams from './teams/AccessTeams'
import AccessUsers from './users/AccessUsers'
import useCurrentUserStore from '@/stores/user'
import FeatureLock from '../FeatureLock'

interface Props {
  workspaceId: string
  projectName: string
}

const ProjectAccess: React.FC<Props> = ({ projectName, workspaceId }) => {
  const { isFreeWorkspacePlan } = useCurrentUserStore()

  return (
    <div className="mt-4 flex flex-col gap-6 md:gap-8 px-6 lg:px-10">
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

      {/* <Separator /> */}

      {!isFreeWorkspacePlan() && (
        <div className="">
          <AccessTeams workspaceId={workspaceId} projectName={projectName} />
        </div>
      )}

      {isFreeWorkspacePlan() && (
        <div className="">
          <FeatureLock
            showLink={false}
            workspaceId={workspaceId}
            text="Team access is available only for paid plans"
          />
        </div>
      )}
    </div>
  )
}

export default ProjectAccess
