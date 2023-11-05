import { Button } from '../ui/button'

interface Props {
  workspaceId: string
  projectName: string
}

const ProjectAccess: React.FC<Props> = ({ projectName, workspaceId }) => {
  return (
    <div className="mt-4 flex flex-col gap-3 px-6 lg:px-10">
      <div className="py-2 pl-4 pr-2 flex items-center justify-between rounded-md border w-full">
        <div className="dark:text-gray-400 text-gray-700 font-bold">Edit access</div>
        <div>
          <Button variant="default" size={'sm'}>
            Edit user access
          </Button>
        </div>
      </div>

      <div>TABLE WITH USERS</div>
      <div>TABLE WITH TEAMS</div>
    </div>
  )
}

export default ProjectAccess
