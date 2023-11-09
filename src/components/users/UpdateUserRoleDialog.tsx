'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '../ui/label'
import { useUpdateEffect } from 'react-use'
import UserRoleBadge from './UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { useUpdateWorkspaceUserRole } from '@/api/mutations/users'
import { usersErrorMsgFromCode } from '@/api/requests/users'
import DialogComponent from '../Dialog'

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

  return (
    <>
      <DialogComponent
        opened={opened}
        title={'Change user role'}
        description={`Users access level is determined by their role.`}
        submit={{
          text: 'Confirm',
          variant: 'default',
          disabled: selectedRole === user.role,
        }}
        error={error ? usersErrorMsgFromCode(error.code) ?? 'Something went wrong' : undefined}
        loading={isLoading}
        onSubmit={() => updateUserRole({ workspaceId, userId: user.id, role: selectedRole })}
        onClose={onClose}
      >
        <div className="flex flex-col gap-3 pb-6 mt-2">
          <div>
            <Label htmlFor="name" className="text-right pl-1 text-[0.9rem]">
              <span className="font-normal">User:</span> {user?.name}
            </Label>
          </div>
          <div className="flex flex-col gap-1 items-start justify-center">
            <div>
              <Label htmlFor="Role" className="text-right pl-1">
                Role
              </Label>
            </div>
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
        </div>
      </DialogComponent>
    </>
  )
}

export default UpdateWorkspaceUserRoleDialog
