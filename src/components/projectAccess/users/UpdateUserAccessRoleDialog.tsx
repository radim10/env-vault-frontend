'use client'

import { useUpdateProjectAccessUserRole } from '@/api/mutations/projectAccess'
import { projectAccessErrorMsgFromCode } from '@/api/requests/projectAccess'
import DialogComponent from '@/components/Dialog'
import { Label } from '@/components/ui/label'
import { ProjectRole } from '@/types/projectAccess'
import { useState } from 'react'
import { useUpdateEffect } from 'react-use'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'

const roles: ProjectRole[] = [ProjectRole.MEMBER, ProjectRole.ADMIN, ProjectRole.OWNER]

interface Props {
  opened: boolean
  workspaceId: string
  projectName: string
  user: {
    id: string
    name: string
    role: ProjectRole
  }

  onClose: () => void
  onSuccess: (type: ProjectRole) => void
}

const UpdateUserAccessRoleDialog: React.FC<Props> = ({
  opened,
  workspaceId,
  projectName,
  user,
  onClose,
  onSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<ProjectRole>(user.role)

  const {
    mutate: updateUserRole,
    isLoading,
    error,
    reset,
  } = useUpdateProjectAccessUserRole({
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
        title={'Change project user role'}
        description={`Project access level is determined by the role.`}
        submit={{
          text: 'Confirm',
          variant: 'default',
          disabled: selectedRole === user.role,
        }}
        error={
          error
            ? error?.code
              ? projectAccessErrorMsgFromCode(error.code)
              : 'Something went wrong'
            : undefined
        }
        loading={isLoading}
        onSubmit={() => {
          updateUserRole({
            workspaceId,
            projectName,
            userId: user?.id,
            data: { role: selectedRole },
          })
        }}
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
                Project role
              </Label>
            </div>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as ProjectRole)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    value={role}
                    key={role}
                    className="px-10"
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <UserRoleBadge role={role as any as WorkspaceUserRole} />
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

export default UpdateUserAccessRoleDialog
