import { useUpdateEffect } from 'react-use'
import DialogComponent from '@/components/Dialog'
import { useUpdateProjectAccessUsers } from '@/api/mutations/projectAccess'
import {
  UpdateProjectAccessUsersData,
  projectAccessErrorMsgFromCode,
} from '@/api/requests/projectAccess'

interface Props {
  projectName: string
  workspaceId: string
  opened: boolean
  users: Array<{
    id: string
    name: string
  }>

  onClose: () => void
  onSuccess: () => void
}

const DeleteProjectUserAccessDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  users,
  opened,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: updateTeamAccess,
    isLoading,
    error,
    reset,
  } = useUpdateProjectAccessUsers({
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
      title={'Remove users'}
      submit={{
        text: 'Remove',
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
          {users?.length === 1 ? (
            <span>
              Are you sure you want to remove <span className="font-bold">{users[0].name}</span>{' '}
              from team from this project?
            </span>
          ) : (
            <span>
              Are you sure you want to remove <span className="font-bold">{users?.length}</span>{' '}
              from team from this project?
            </span>
          )}
        </>
      }
      loading={isLoading}
      onSubmit={() => {
        const ids = users.map((user) => user.id)

        const data: UpdateProjectAccessUsersData = {
          remove: ids,
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

export default DeleteProjectUserAccessDialog
