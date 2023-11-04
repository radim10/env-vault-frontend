import { useUpdateEffect } from 'react-use'
import DialogComponent from '../Dialog'
import { useState } from 'react'
import { useUpdateTeam } from '@/api/mutations/teams'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Icons } from '../icons'
import { teamsErrorMsgFromCode } from '@/api/requests/teams'
import { UpdateTeamData } from '@/types/teams'

interface Props {
  opened: boolean
  workspaceId: string
  teamId: string

  prevName: string
  prevDesciption: string

  onSuccess: (updated: UpdateTeamData) => void
  onClose: () => void
}

const UpdateTeamDialog: React.FC<Props> = ({
  opened,
  workspaceId,
  teamId,
  prevName,
  prevDesciption,
  onSuccess,
  onClose,
}) => {
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')

  const { mutate: updateTeam, isLoading, error, reset } = useUpdateTeam()

  const close = () => {
    if (isLoading) return
    onClose()
  }

  useUpdateEffect(() => {
    setName(prevName)
    setDescription(prevDesciption)
  }, [opened])

  useUpdateEffect(() => {
    if (!opened) {
      setTimeout(() => {
        reset()
      }, 150)
    }
  }, [opened])

  const handleUpdateTeam = () => {
    const updatedTeam: UpdateTeamData = {}

    if (name !== prevName) {
      updatedTeam.name = name
    }

    if (description !== prevDesciption) {
      if (prevDesciption?.length === 0) {
        if (description?.trim()?.length > 0) {
          updatedTeam.description = description
        }
      } else {
        if (description?.trim()?.length > 0) {
          updatedTeam.description = description
        } else {
          updatedTeam.description = null
        }
      }
    }

    updateTeam(
      {
        workspaceId,
        teamId,
        data: updatedTeam,
      },
      {
        onSuccess: () => onSuccess(updatedTeam),
      }
    )
  }

  return (
    <div>
      <DialogComponent
        opened={opened}
        loading={isLoading}
        title="Update team"
        description="Update this team's name or description"
        submit={{
          text: 'Update',
          disabled:
            name?.trim().length < 2 ||
            isLoading ||
            (name === prevName && prevDesciption === description),
        }}
        onClose={() => onClose()}
        onSubmit={() => handleUpdateTeam()}
      >
        <div className="flex flex-col gap-4 py-4 text-lg">
          <div className="flex flex-col gap-1.5 items-start justify-center">
            <Label htmlFor="name" className="text-right pl-1">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              disabled={isLoading}
              autoFocus={false}
              placeholder="Project name"
              // onChange={(e) => setName(e.target.value?.replace(/[\/\s?]/g, '-'))}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 items-start justify-center">
            <Label htmlFor="description" className="text-right pl-1">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              disabled={isLoading}
              autoFocus={false}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {error?.code ? teamsErrorMsgFromCode(error.code) : 'Something went wrong'}
            </div>
          )}
        </div>
      </DialogComponent>
    </div>
  )
}

export default UpdateTeamDialog
