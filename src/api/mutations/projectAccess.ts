import { useMutation } from '@tanstack/react-query'
import {
  UpdateProjectAccessTeamsArgs,
  UpdateProjectAccessTeamsError,
  UpdateProjectAccessTeamsResData,
  UpdateProjectAccessUsersArgs,
  UpdateProjectAccessUsersError,
  UpdateProjectAccessUsersResData,
  addProjectAccessTeams,
  updateProjectAccessUsers,
} from '../requests/projectAccess'
import { MutOpt } from './mutOpt'

type UseAddProjectAccessTeamsVariables = UpdateProjectAccessTeamsArgs

export const useUpdateProjectAccessTeams = (opt?: MutOpt<UpdateProjectAccessTeamsResData>) =>
  useMutation<
    UpdateProjectAccessTeamsResData,
    UpdateProjectAccessTeamsError,
    UseAddProjectAccessTeamsVariables
  >(addProjectAccessTeams, opt)

// users
type UseUpdateProjectAccessUsersVariables = UpdateProjectAccessUsersArgs

export const useUpdateProjectAccessUsers = (opt?: MutOpt<UpdateProjectAccessUsersResData>) =>
  useMutation<
    UpdateProjectAccessUsersResData,
    UpdateProjectAccessUsersError,
    UseUpdateProjectAccessUsersVariables
  >(updateProjectAccessUsers, opt)
