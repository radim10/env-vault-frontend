import { useMutation } from '@tanstack/react-query'
import {
  UpdateProjectAccessTeamsArgs,
  UpdateProjectAccessTeamsError,
  UpdateProjectAccessTeamsResData,
  addProjectAccessTeams,
} from '../requests/projectAccess'
import { MutOpt } from './mutOpt'

type UseAddProjectAccessTeamsVariables = UpdateProjectAccessTeamsArgs

export const useUpdateProjectAccessTeams = (opt?: MutOpt<UpdateProjectAccessTeamsResData>) =>
  useMutation<
    UpdateProjectAccessTeamsResData,
    UpdateProjectAccessTeamsError,
    UseAddProjectAccessTeamsVariables
  >(addProjectAccessTeams, opt)
