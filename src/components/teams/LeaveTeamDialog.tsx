import { useLeaveTeam } from '@/api/mutations/teams'
import DeleteDialog from '../DeleteDialog'
import { teamsErrorMsgFromCode } from '@/api/requests/teams'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Icons } from '../icons'
import { useUpdateEffect } from 'react-use'

interface Props {
  opened: boolean
  workspaceId: string
  team: {
    id: string
    name: string
  }
  onClose: () => void
  onLeave: () => void
}

const LeaveTeamDialog: React.FC<Props> = ({ workspaceId, team, opened, onClose, onLeave }) => {
  const [confirmText, setConfirmText] = useState('')

  const {
    mutate: leaveTeam,
    isLoading,
    error,
    reset,
  } = useLeaveTeam({
    onSuccess: () => onLeave(),
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  return (
    <>
      <DeleteDialog
        opened={opened}
        onClose={onClose}
        title="Leave team"
        icon={Icons.doorOpen}
        inProgress={isLoading}
        disabledConfirm={confirmText !== team?.name}
        onConfirm={() => leaveTeam({ workspaceId, teamId: team?.id })}
      >
        <div className="flex flex-col gap-4 p0-4 pb-4">
          <div className="text-[0.92rem]">
            If you leave this team, you will no longer have the access to projects that this team
            has access to.
          </div>

          <div className="text-[0.92rem] ">
            Type <span className="font-bold text-red-600">{team?.name}</span> to confirm this
            action.
          </div>

          <Input
            className="-mt-1.5"
            placeholder={team?.name}
            disabled={isLoading}
            onChange={(e) => setConfirmText(e.target.value)}
          />

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {error?.code ? teamsErrorMsgFromCode(error.code) : 'Something went wrong'}
            </div>
          )}
        </div>
      </DeleteDialog>
    </>
  )
}

export default LeaveTeamDialog
