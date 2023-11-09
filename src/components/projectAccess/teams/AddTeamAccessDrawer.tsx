'use client'

import clsx from 'clsx'
import { useState } from 'react'
import Drawer from '@/components/Drawer'
import { ListTeam } from '@/types/teams'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateProjectAccessTeams } from '@/api/mutations/projectAccess'
import { ProjectAccessTeam, ProjectRole } from '@/types/projectAccess'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { UpdateProjectAccessTeamsData } from '@/api/requests/projectAccess'
import { Icons } from '@/components/icons'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'
import { useImmer } from 'use-immer'
import ProjectAccessTeamCombobox from './ProjectAccessTeamCombobox'
import { Badge } from '@/components/ui/badge'
import ProjectRoleSelect from '../ProjectRoleSelect'

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

  const [selectedTeams, setSelectedTeams] = useImmer<ProjectAccessTeam[]>([])
  const [selectedRole, setSelectedRole] = useState<ProjectRole>(ProjectRole.MEMBER)

  const { mutate, isLoading, error } = useUpdateProjectAccessTeams({
    onSuccess: () => {
      onAdded(selectedTeams?.map((val) => ({ ...val, role: selectedRole })))
    },
  })

  const handleSelectedTeams = (teams: ListTeam[], role: ProjectRole) => {
    const existingTeams = selectedTeams.filter((user) => {
      return teams.some((selectedTeam) => selectedTeam.id === user.id)
    })

    const newTeams = teams.filter((user) => {
      return !selectedTeams.some((selectedTeam) => selectedTeam.id === user.id)
    })

    setSelectedTeams([...existingTeams, ...newTeams.map((team) => ({ ...team, role }))])
  }

  const handleRemovedTeam = (index: number, role: ProjectRole) => {
    const items = selectedTeams?.filter((team) => team.role === role)
    if (!items) return

    const item = items?.[index]
    const wholeIndex = selectedTeams?.findIndex((team) => team.id === item?.id)

    if (wholeIndex === -1) return

    setSelectedTeams((draft) => {
      draft.splice(wholeIndex, 1)
    })
  }

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
            const addedTeams = selectedTeams.map((team) => ({ id: team?.id, role: team?.role }))

            const payload: UpdateProjectAccessTeamsData = {
              add: addedTeams,
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
          <ProjectRoleSelect
            selected={selectedRole}
            onValueChange={setSelectedRole}
            disabled={isLoading}
          />

          <ProjectAccessTeamCombobox
            queryClient={queryClient}
            workspaceId={workspaceId}
            project={projectName}
            disabled={isLoading}
            selectedTeams={selectedTeams}
            onSelect={(teams) => {
              handleSelectedTeams(teams, selectedRole)
            }}
          />

          {/* // SELECTED */}
          {selectedTeams?.filter((val) => val?.role === ProjectRole.OWNER).length > 0 && (
            <SelectedRoleSection
              teams={selectedTeams?.filter((val) => val?.role === ProjectRole.OWNER)}
              role={ProjectRole.OWNER}
              isLoading={isLoading}
              onRemove={(user) => handleRemovedTeam(user, ProjectRole.OWNER)}
            />
          )}

          {selectedTeams?.filter((val) => val?.role === ProjectRole.ADMIN).length > 0 && (
            <SelectedRoleSection
              teams={selectedTeams?.filter((val) => val?.role === ProjectRole.ADMIN)}
              role={ProjectRole.ADMIN}
              isLoading={isLoading}
              onRemove={(user) => handleRemovedTeam(user, ProjectRole.ADMIN)}
            />
          )}

          {selectedTeams?.filter((val) => val?.role === ProjectRole.MEMBER).length > 0 && (
            <SelectedRoleSection
              teams={selectedTeams?.filter((val) => val?.role === ProjectRole.MEMBER)}
              role={ProjectRole.MEMBER}
              isLoading={isLoading}
              onRemove={(user) => handleRemovedTeam(user, ProjectRole.MEMBER)}
            />
          )}
        </div>
      </Drawer>
    </>
  )
}

interface SectionProps {
  role: ProjectRole
  teams: ProjectAccessTeam[]
  isLoading?: boolean
  onRemove: (index: number) => void
}

const SelectedRoleSection = ({ role, teams, isLoading, onRemove }: SectionProps) => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="w-fit">
          <UserRoleBadge role={role as any as WorkspaceUserRole} className="px-4" />
        </div>
        <div className="flex flex-row gap-2 items-center flex-wrap Xbg-red-400">
          {teams.map((team, index) => (
            <div>
              <Badge variant="outline" className="pl-3">
                <div className="flex items-center gap-1.5 text-sm ">
                  <span className="text-muted-foregroundXXX">{team.name}</span>
                  <span
                    className={clsx(
                      ['pl-0.5 cursor-pointer opacity-70 hover:opacity-100 duration-200'],
                      {
                        'opacity-50': isLoading,
                      }
                    )}
                    onClick={(e) => {
                      if (isLoading) return
                      e.stopPropagation()

                      onRemove(index)
                    }}
                  >
                    <Icons.x className="h-4 w-4" />
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

export default AddTeamAccessDrawer
