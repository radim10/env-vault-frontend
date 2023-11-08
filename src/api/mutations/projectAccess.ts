import { useMutation } from '@tanstack/react-query'
import {
  UpdateProjectAccessTeamRoleArgs,
  UpdateProjectAccessTeamRoleError,
  UpdateProjectAccessTeamRoleResData,
  UpdateProjectAccessTeamsArgs,
  UpdateProjectAccessTeamsError,
  UpdateProjectAccessTeamsResData,
  UpdateProjectAccessUserRoleArgs,
  UpdateProjectAccessUserRoleError,
  UpdateProjectAccessUserRoleResData,
  UpdateProjectAccessUsersArgs,
  UpdateProjectAccessUsersError,
  UpdateProjectAccessUsersResData,
  updateProjectAccessTeamRole,
  updateProjectAccessTeams,
  updateProjectAccessUserRole,
  updateProjectAccessUsers,
} from '../requests/projectAccess'
import { MutOpt } from './mutOpt'

type UseAddProjectAccessTeamsVariables = UpdateProjectAccessTeamsArgs

export const useUpdateProjectAccessTeams = (opt?: MutOpt<UpdateProjectAccessTeamsResData>) =>
  useMutation<
    UpdateProjectAccessTeamsResData,
    UpdateProjectAccessTeamsError,
    UseAddProjectAccessTeamsVariables
  >(updateProjectAccessTeams, opt)

// users
type UseUpdateProjectAccessUsersVariables = UpdateProjectAccessUsersArgs

export const useUpdateProjectAccessUsers = (opt?: MutOpt<UpdateProjectAccessUsersResData>) =>
  useMutation<
    UpdateProjectAccessUsersResData,
    UpdateProjectAccessUsersError,
    UseUpdateProjectAccessUsersVariables
  >(updateProjectAccessUsers, opt)

// update single user role
export const useUpdateProjectAccessUserRole = (opt?: MutOpt<UpdateProjectAccessUserRoleResData>) =>
  useMutation<
    UpdateProjectAccessUserRoleResData,
    UpdateProjectAccessUserRoleError,
    UpdateProjectAccessUserRoleArgs
  >(updateProjectAccessUserRole, opt)

// update single team role
export const useUpdateProjectAccessTeamRole = (opt?: MutOpt<UpdateProjectAccessTeamRoleResData>) =>
  useMutation<
    UpdateProjectAccessTeamRoleResData,
    UpdateProjectAccessTeamRoleError,
    UpdateProjectAccessTeamRoleArgs
  >(updateProjectAccessTeamRole, opt)
