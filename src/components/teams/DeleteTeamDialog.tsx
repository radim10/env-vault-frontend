import { useState } from 'react'
import DeleteDialog from '../DeleteDialog'
import { Input } from '../ui/input'
import { Icons } from '../icons'
import { useUpdateEffect } from 'react-use'
import { useDeleteTeam } from '@/api/mutations/teams'
import { teamsErrorMsgFromCode } from '@/api/requests/teams'

interface Props {
  workspaceId: string
  team: {
    id: string
    name: string
  }
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const DeleteTeamDialog: React.FC<Props> = ({ workspaceId, team, opened, onClose, onSuccess }) => {
  const [name, setName] = useState('')

  const {
    mutate: deleteTeam,
    isLoading,
    error,
    reset,
  } = useDeleteTeam({
    onSuccess: () => onSuccess(),
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  return (
    <div>
      <DeleteDialog
        opened={opened}
        onClose={onClose}
        inProgress={isLoading}
        disabledConfirm={name !== team?.name}
        title="Delete this team?"
        onConfirm={() => deleteTeam({ workspaceId, teamId: team.id })}
      >
        <div className="flex flex-col gap-4 p0-4 pb-4">
          <div className="text-[0.92rem]">
            Type <span className="font-bold text-red-600">{team?.name}</span> to confirm this
            action.
          </div>

          <Input
            placeholder={team?.name}
            disabled={isLoading}
            onChange={(e) => setName(e.target.value)}
          />

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {error?.code ? teamsErrorMsgFromCode(error.code) : 'Something went wrong'}
            </div>
          )}
        </div>
      </DeleteDialog>
    </div>
  )
}

export default DeleteTeamDialog
