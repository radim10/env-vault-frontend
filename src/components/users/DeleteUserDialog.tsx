import React, { useState } from 'react'
import DeleteDialog from '../DeleteDialog'
import { Input } from '../ui/input'
import { Icons } from '../icons'
import { useUpdateEffect } from 'react-use'
import { useDeleteWorkspaceUser } from '@/api/mutations/users'
import { usersErrorMsgFromCode } from '@/api/requests/users'
import { Dialog } from '@radix-ui/react-dialog'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'

interface Props {
  workspaceId: string
  opened: boolean
  user: {
    name: string
    id: string
  }
  onClose: () => void
  onSuccess: () => void
}

const DeleteWorkspaceUserDialog: React.FC<Props> = ({
  workspaceId,
  user,
  opened,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('')

  const {
    mutate: deleteUser,
    isLoading,
    error,
    reset,
  } = useDeleteWorkspaceUser({
    onSuccess: () => onSuccess(),
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  const close = () => {
    if (isLoading) return
    onClose()
  }

  return (
    <div>
      <Dialog
        open={opened}
        onOpenChange={(e) => {
          if (!e) close()
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user {user?.name} from this environment?
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="">
              <div className="text-red-600 text-[0.92rem] py-2 flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {error?.code ? usersErrorMsgFromCode(error.code) : 'Something went wrong'}
              </div>
            </div>
          )}
          <DialogFooter className="mt-1">
            <Button
              className="w-full"
              type="submit"
              variant="destructive"
              loading={isLoading}
              disabled={isLoading}
              onClick={() => deleteUser({ workspaceId, userId: user?.id })}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeleteWorkspaceUserDialog
