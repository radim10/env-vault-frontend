import { useUpdateEffect } from 'react-use'
import { useUpdateTeamMembers } from '@/api/mutations/teams'
import { teamsErrorMsgFromCode } from '@/api/requests/teams'
import DialogComponent from '@/components/Dialog'
import { useUpdateProjectAccessTeams } from '@/api/mutations/projectAccess'
import {
  UpdateProjectAccessTeamsData,
  projectAccessErrorMsgFromCode,
} from '@/api/requests/projectAccess'

interface Props {
  projectName: string
  workspaceId: string
  opened: boolean
  team: {
    id: string
    name: string
  }

  onClose: () => void
  onSuccess: () => void
}

const DeleteProjectTeamAccessDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  team,
  opened,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: updateTeamAccess,
    isLoading,
    error,
    reset,
  } = useUpdateProjectAccessTeams({
    onSuccess: () => onSuccess(),
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  return (
    <DialogComponent
      opened={opened}
      title={'Delete team'}
      submit={{
        text: 'Delete',
        disabled: false,
        wFull: true,
        variant: 'destructive',
      }}
      error={
        error
          ? error?.code
            ? projectAccessErrorMsgFromCode(error.code)
            : 'Something went wrong'
          : undefined
      }
      descriptionComponent={
        <>
          <span>
            Are you sure you want to remove <span className="font-bold">{team.name}</span> from team
            from this project?
          </span>
        </>
      }
      loading={isLoading}
      onSubmit={() => {
        const data: UpdateProjectAccessTeamsData = {
          remove: [team.id],
        }

        updateTeamAccess({
          workspaceId,
          projectName,
          data,
        })
      }}
      onClose={onClose}
    />
  )
}

export default DeleteProjectTeamAccessDialog
