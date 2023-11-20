import { useState } from 'react'
import { useUpdateProjectAccessUsers } from '@/api/mutations/projectAccess'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'
import Drawer from '@/components/Drawer'
import { Icons } from '@/components/icons'
import { ProjectAccessUser, ProjectRole } from '@/types/projectAccess'
import { useQueryClient } from '@tanstack/react-query'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { User, WorkspaceUserRole } from '@/types/users'
import { useImmer } from 'use-immer'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UpdateProjectAccessUsersData } from '@/api/requests/projectAccess'
import clsx from 'clsx'
import ProjectAccessUserCombobox from './ProjectAccessUserCombobox'
import ProjectRoleSelect from '../ProjectRoleSelect'
import ProjectRoleBadge from '@/components/projects/ProjectRoleBadge'
import { useUpdateEffect } from 'react-use'

interface Props {
  workspaceId: string
  projectName: string
  opened: boolean
  onAdded: (users: ProjectAccessUser[]) => void
  onClose: () => void
}

const AddUsersAccessDrawer: React.FC<Props> = ({
  workspaceId,
  projectName,
  opened,
  onAdded,
  onClose,
}) => {
  const queryClient = useQueryClient()

  const { mutate, isLoading, error, reset } = useUpdateProjectAccessUsers({
    onSuccess: () => onAdded(selectedUsers),
  })

  const [selectedUsers, setSelectedUsers] = useImmer<Array<ProjectAccessUser>>([])
  const [selectedRole, setSelectedRole] = useState<ProjectRole>(ProjectRole.VIEWER)

  const handleSelectedUsers = (users: User[], role: ProjectRole) => {
    const existingUsers = selectedUsers.filter((user) => {
      return users.some((selectedUser) => selectedUser.id === user.id)
    })

    const newUsers = users.filter((user) => {
      return !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
    })

    setSelectedUsers([...existingUsers, ...newUsers.map((user) => ({ ...user, role }))])
  }

  const handleRemovedUser = (index: number, role: ProjectRole) => {
    const items = selectedUsers?.filter((user) => user.role === role)
    if (!items) return

    const item = items?.[index]
    const wholeIndex = selectedUsers?.findIndex((user) => user.id === item?.id)

    if (wholeIndex === -1) return

    setSelectedUsers((draft) => {
      draft.splice(wholeIndex, 1)
    })
  }

  useUpdateEffect(() => {
    if (!opened) {
      setTimeout(() => {
        setSelectedUsers([])
        setSelectedRole(ProjectRole.VIEWER)
        reset()
      }, 200)
    }
  }, [opened])

  return (
    <>
      <Drawer
        opened={opened}
        title="Add user access"
        description="Add access to this project for selected users"
        onClose={onClose}
        submit={{
          text: 'Confirm',
          disabled: selectedUsers.length === 0,
          loading: isLoading,
          onSubmit: () => {
            const users = selectedUsers.map((user) => {
              return {
                id: user.id,
                role: user.role,
              }
            })

            const payload: UpdateProjectAccessUsersData = {
              add: users,
            }

            console.log('payload', payload)

            mutate({
              workspaceId,
              projectName,
              data: {
                add: users,
              },
            })
          },
        }}
      >
        {error && (
          <>
            <div className="text-red-600 text-[0.90rem] pb-0 flex items-center gap-2 mb-5">
              <Icons.xCircle className="h-4 w-4" />
              {error?.code ? projectErrorMsgFromCode(error.code) : 'Something went wrong'}
            </div>
          </>
        )}

        <div className="flex flex-col gap-6">
          <ProjectRoleSelect
            selected={selectedRole}
            onValueChange={setSelectedRole}
            disabled={isLoading}
          />

          <ProjectAccessUserCombobox
            queryClient={queryClient}
            workspaceId={workspaceId}
            projectName={projectName}
            // project={projectName}
            disabled={isLoading}
            // selectedUsers={selectedUsers}
            selectedUsers={selectedUsers}
            onSelect={(users) => {
              // setSelectedUsers(users)
              handleSelectedUsers(users, selectedRole)
            }}
          />

          {selectedUsers?.filter((val) => val?.role === ProjectRole.ADMIN).length > 0 && (
            <SelectedRoleSection
              users={selectedUsers?.filter((val) => val?.role === ProjectRole.ADMIN)}
              role={ProjectRole.ADMIN}
              isLoading={isLoading}
              onRemove={(user) => handleRemovedUser(user, ProjectRole.ADMIN)}
            />
          )}

          {selectedUsers?.filter((val) => val?.role === ProjectRole.EDITOR).length > 0 && (
            <SelectedRoleSection
              users={selectedUsers?.filter((val) => val?.role === ProjectRole.EDITOR)}
              role={ProjectRole.EDITOR}
              isLoading={isLoading}
              onRemove={(user) => handleRemovedUser(user, ProjectRole.EDITOR)}
            />
          )}

          {selectedUsers?.filter((val) => val?.role === ProjectRole.VIEWER).length > 0 && (
            <SelectedRoleSection
              users={selectedUsers?.filter((val) => val?.role === ProjectRole.VIEWER)}
              role={ProjectRole.VIEWER}
              isLoading={isLoading}
              onRemove={(user) => handleRemovedUser(user, ProjectRole.VIEWER)}
            />
          )}
        </div>
      </Drawer>
    </>
  )
}

interface SectionProps {
  role: ProjectRole
  users: User[]
  isLoading?: boolean
  onRemove: (index: number) => void
}

const SelectedRoleSection = ({ role, users, isLoading, onRemove }: SectionProps) => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="w-fit">
          <ProjectRoleBadge role={role} className="px-4" />
        </div>
        <div className="flex flex-row gap-2 items-center flex-wrap Xbg-red-400">
          {users.map((user, index) => (
            <div>
              <Badge variant="outline" className="pl-0.5">
                <div className="flex items-center gap-2 text-sm " key={index}>
                  <Avatar className="w-7 h-7 opacity-90">
                    <AvatarImage src={user.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-transparent border-2 text-sm">CN</AvatarFallback>
                  </Avatar>

                  <span className="text-muted-foregroundXXX">{user.name}</span>
                  <span
                    className={clsx(
                      ['px-1 cursor-pointer text-opacity-50 hover:text-opacity-100 duration-200'],
                      {
                        'opacity-0': isLoading,
                      }
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isLoading) return
                      onRemove(index)
                      // removeSelectedItem(selectedItemForRender)
                    }}
                  >
                    &#10005;
                  </span>
                </div>
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AddUsersAccessDrawer
