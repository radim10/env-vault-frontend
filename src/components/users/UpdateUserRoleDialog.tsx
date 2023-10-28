'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icons } from '../icons'
import { Label } from '../ui/label'
import { useUpdateEffect } from 'react-use'
import UserRoleBadge from './UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { useUpdateWorkspaceUserRole } from '@/api/mutations/users'
import { usersErrorMsgFromCode } from '@/api/requests/users'

interface Props {
  opened: boolean
  workspaceId: string
  user: {
    id: string
    name: string
    role: WorkspaceUserRole
  }
  onClose: () => void
  onSuccess: (type: WorkspaceUserRole) => void
}

const roleTypes: WorkspaceUserRole[] = [
  WorkspaceUserRole.MEMBER,
  WorkspaceUserRole.ADMIN,
  WorkspaceUserRole.OWNER,
]

const UpdateWorkspaceUserRoleDialog: React.FC<Props> = ({
  workspaceId,
  opened,
  user,
  onClose,
  onSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<WorkspaceUserRole>(user.role)

  const {
    mutate: updateUserRole,
    isLoading,
    error,
    reset,
  } = useUpdateWorkspaceUserRole({
    onSuccess: () => {
      onSuccess(selectedRole)
    },
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
    <>
      <Dialog
        open={opened}
        onOpenChange={(e) => {
          if (!e) {
            close()
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change user role</DialogTitle>
            <DialogDescription>Users access level is determined by their role.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pb-4 mt-2 text-lg">
            <div>
              <Label htmlFor="name" className="text-right pl-1 text-[0.9rem]">
                <span className="font-normal">User:</span> {user?.name}
              </Label>
            </div>
            <div className="flex flex-col gap-2 items-start justify-center">
              <Label htmlFor="type" className="text-right pl-1">
                Type
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as WorkspaceUserRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {roleTypes.map((role) => (
                    <SelectItem
                      value={role}
                      key={role}
                      className="px-10"
                      onFocus={(e) => e.stopPropagation()}
                    >
                      <UserRoleBadge role={role} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {error?.code ? usersErrorMsgFromCode(error?.code) : 'Something went wrong'}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading || selectedRole === user.role}
              onClick={() => {
                updateUserRole({
                  workspaceId,
                  userId: user.id,
                  role: selectedRole,
                })
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UpdateWorkspaceUserRoleDialog
