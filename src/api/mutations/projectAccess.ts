import { useMutation } from '@tanstack/react-query'
import {
  AddProjectAccessTeamsArgs,
  AddProjectAccessTeamsError,
  AddProjectAccessTeamsResData,
  addProjectAccessTeams,
} from '../requests/projectAccess'
import { MutOpt } from './mutOpt'

type UseAddProjectAccessTeamsVariables = AddProjectAccessTeamsArgs

export const useAddProjectAccessTeams = (opt?: MutOpt<AddProjectAccessTeamsResData>) =>
  useMutation<
    AddProjectAccessTeamsResData,
    AddProjectAccessTeamsError,
    UseAddProjectAccessTeamsVariables
  >(addProjectAccessTeams, opt)
