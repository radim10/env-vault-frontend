import { WorkspaceUserRole } from '@/types/users'
import UserRoleBadge from '../users/UserRoleBadge'
import { Separator } from '../ui/separator'
import { Icons } from '@/components/icons'

interface Props {
  workspace: string
  role: WorkspaceUserRole
}

const InvitationHeader: React.FC<Props> = ({ workspace, role }) => {
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-2 w-full opacity-80">
        You have been invited to ZenEnv
        <Icons.userPlus className="w-4 h-4" />
      </div>

      <Separator />
      <div className="flex flex-col gap-1.5 mb-2">
        <div className="flex flex-row gap-2 flex-wrap">
          <div className="font-medium">Workspace:</div>
          <div>{workspace}</div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="font-medium">User role:</div>
          <div>
            <UserRoleBadge role={role} />
          </div>
        </div>
      </div>
    </>
  )
}
export default InvitationHeader
