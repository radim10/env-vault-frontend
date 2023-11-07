import { useState } from 'react'
import { useUpdateProjectAccessUsers } from '@/api/mutations/projectAccess'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'
import Drawer from '@/components/Drawer'
import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectAccessUser, ProjectRole } from '@/types/projectAccess'
import { useQueryClient } from '@tanstack/react-query'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { User, WorkspaceUserRole } from '@/types/users'
import UsersCombobox from '@/components/teams/UsersCombobox'
import { useImmer } from 'use-immer'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UpdateProjectAccessUsersData } from '@/api/requests/projectAccess'

const roles: ProjectRole[] = [ProjectRole.MEMBER, ProjectRole.ADMIN, ProjectRole.OWNER]

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

  const { mutate, isLoading, error } = useUpdateProjectAccessUsers()

  const [selectedUsers, setSelectedUsers] = useImmer<Array<User & { role: ProjectRole }>>([])
  const [selectedRole, setSelectedRole] = useState<ProjectRole>(ProjectRole.MEMBER)

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

  // const [usersByRole, setUsersByRole] = useImmer<{
  //   [key in ProjectRole | any]: User[]
  // }>({
  //   MEMBER: [],
  //   ADMIN: [],
  //   OWNER: [],
  // })
  //
  //
  // const handleSelectedUsers = (users: User[], role: ProjectRole) => {
  //   const allCurrentSelected = [...selectedMembers, ...selectedAdmins, ...selectedOwners]
  //
  //   const usersToDelete = allCurrentSelected.filter((user) => {
  //     return users.some((selectedUser) => selectedUser.id === user.id)
  //   })
  //
  //   for (const user of usersToDelete) {
  //     const membersIndex = selectedMembers.findIndex((u) => u.id === user.id)
  //
  //     if (membersIndex !== -1) {
  //       setSelectedMembers((draft) => {
  //         draft.splice(membersIndex, 1)
  //       })
  //       break
  //     }
  //
  //     const adminsIndex = selectedAdmins.findIndex((u) => u.id === user.id)
  //
  //     if (adminsIndex !== -1) {
  //       setSelectedAdmins((draft) => {
  //         draft.splice(adminsIndex, 1)
  //       })
  //       break
  //     }
  //
  //     const ownersIndex = selectedOwners.findIndex((u) => u.id === user.id)
  //
  //     if (ownersIndex !== -1) {
  //       setSelectedOwners((draft) => {
  //         draft.splice(ownersIndex, 1)
  //       })
  //
  //       break
  //     }
  //   }
  //
  //   const newUsers = users
  //   // const newUsers = users?.filter((user) => {
  //   //   return !usersToDelete.some((selectedUser) => selectedUser.id === user.id)
  //   // })
  //   //
  //   if (role === ProjectRole.MEMBER) {
  //     setSelectedMembers(newUsers)
  //   } else if (role === ProjectRole.ADMIN) {
  //     setSelectedAdmins(newUsers)
  //   } else if (role === ProjectRole.OWNER) {
  //     setSelectedOwners(newUsers)
  //   }
  // }

  // const handleSelectedUsers = (users: User[], role: ProjectRole) => {
  //   const allCurrentSelected = Object.values(usersByRole).flat(1)
  //
  //   console.log('allCurrentSelected', allCurrentSelected)
  //   const uniqueUsers = users
  //
  //   // const uniqueUsers = users.filter((user) => {
  //   //   return !allCurrentSelected.some((selectedUser) => selectedUser.id === user.id)
  //   // })
  //   //
  //   // console.log('uniqueUsers', uniqueUsers)
  //
  //   if (role === ProjectRole.MEMBER) {
  //     setUsersByRole((draft) => {
  //       draft.MEMBER = uniqueUsers
  //     })
  //   } else if (role === ProjectRole.ADMIN) {
  //     setUsersByRole((draft) => {
  //       draft.ADMIN = uniqueUsers
  //     })
  //   } else if (role === ProjectRole.OWNER) {
  //     setUsersByRole((draft) => {
  //       draft.OWNER = uniqueUsers
  //     })
  //   }
  // }
  //
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

            // const teamIds = selectedTeams.map((team) => team.id)
            //
            // const payload: UpdateProjectAccessTeamsData = {
            //   add: {
            //     ids: teamIds,
            //     role: selectedRole,
            //   },
            // }
            //
            // mutate({
            //   workspaceId,
            //   projectName,
            //   data: payload,
            // })
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
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="Role" className="">
                <span className="">Project role</span>
              </Label>
            </div>
            <Select
              onValueChange={(value) => setSelectedRole(value as ProjectRole)}
              value={selectedRole}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    value={role}
                    key={role}
                    className="px-10"
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <UserRoleBadge role={role as any as WorkspaceUserRole} className="px-4" />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <UsersCombobox
            hideSelected
            queryClient={queryClient}
            workspaceId={workspaceId}
            // project={projectName}
            disabled={isLoading}
            // selectedUsers={selectedUsers}
            selectedUsers={selectedUsers}
            onSelect={(users) => {
              // setSelectedUsers(users)
              handleSelectedUsers(users, selectedRole)
            }}
          />

          {selectedUsers?.filter((val) => val?.role === ProjectRole.OWNER).length > 0 && (
            <SelectedRoleSection
              users={selectedUsers?.filter((val) => val?.role === ProjectRole.OWNER)}
              role={ProjectRole.OWNER}
              onRemove={(user) => handleRemovedUser(user, ProjectRole.OWNER)}
            />
          )}

          {selectedUsers?.filter((val) => val?.role === ProjectRole.ADMIN).length > 0 && (
            <SelectedRoleSection
              users={selectedUsers?.filter((val) => val?.role === ProjectRole.ADMIN)}
              role={ProjectRole.ADMIN}
              onRemove={(user) => handleRemovedUser(user, ProjectRole.ADMIN)}
            />
          )}

          {selectedUsers?.filter((val, index) => val?.role === ProjectRole.MEMBER).length > 0 && (
            <SelectedRoleSection
              users={selectedUsers?.filter((val) => val?.role === ProjectRole.MEMBER)}
              role={ProjectRole.MEMBER}
              onRemove={(user) => handleRemovedUser(user, ProjectRole.MEMBER)}
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
  onRemove: (index: number) => void
}

const SelectedRoleSection = ({ role, users, onRemove }: SectionProps) => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="w-fit">
          <UserRoleBadge role={role as any as WorkspaceUserRole} className="px-4" />
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
                    className="px-1 cursor-pointer text-opacity-50 hover:text-opacity-100 duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
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
