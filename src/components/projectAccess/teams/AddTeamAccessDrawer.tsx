'use client'

import { useState } from 'react'
import Drawer from '@/components/Drawer'
import { ListTeam } from '@/types/teams'
import { useQueryClient } from '@tanstack/react-query'
import TeamsSearchCombobox from '@/components/teams/TeamsSearchCombobox'
import { useUpdateProjectAccessTeams } from '@/api/mutations/projectAccess'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectAccessTeam, ProjectRole } from '@/types/projectAccess'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { Label } from '@/components/ui/label'
import { UpdateProjectAccessTeamsData } from '@/api/requests/projectAccess'
import { Icons } from '@/components/icons'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'

const roles: ProjectRole[] = [ProjectRole.MEMBER, ProjectRole.ADMIN, ProjectRole.OWNER]

interface Props {
  workspaceId: string
  projectName: string
  opened: boolean
  onAdded: (teams: ProjectAccessTeam[]) => void
  onClose: () => void
}

const AddTeamAccessDrawer: React.FC<Props> = ({
  workspaceId,
  projectName,
  opened,
  onAdded,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const [selectedTeams, setSelectedTeams] = useState<ListTeam[]>([])
  const [selectedRole, setSelectedRole] = useState<ProjectRole>(ProjectRole.MEMBER)

  const { mutate, isLoading, error } = useUpdateProjectAccessTeams({
    onSuccess: () => {
      onAdded(selectedTeams?.map((val) => ({ ...val, role: selectedRole })))
    },
  })

  return (
    <>
      <Drawer
        opened={opened}
        title="Add team access"
        description="Add access to this project for selected teams"
        onClose={onClose}
        submit={{
          text: 'Confirm',
          disabled: selectedTeams.length === 0,
          loading: isLoading,
          onSubmit: () => {
            const teamIds = selectedTeams.map((team) => team.id)

            const payload: UpdateProjectAccessTeamsData = {
              add: {
                ids: teamIds,
                role: selectedRole,
              },
            }

            mutate({
              workspaceId,
              projectName,
              data: payload,
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

          <TeamsSearchCombobox
            queryClient={queryClient}
            workspaceId={workspaceId}
            project={projectName}
            disabled={isLoading}
            selectedTeams={selectedTeams}
            onSelect={(teams) => {
              setSelectedTeams(teams)
            }}
          />
        </div>
      </Drawer>
    </>
  )
}

export default AddTeamAccessDrawer
