import {
  AddTeamMembersArgs,
  AddTeamMembersError,
  AddTeamMembersResData,
  CreateTeamArgs,
  CreateTeamError,
  CreateTeamResData,
  addTeamMembers,
  createTeam,
} from '../requests/teams'
import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'

// update role
type UseCreateTeamVariables = CreateTeamArgs

export const useCreateTeam = (opt?: MutOpt<CreateTeamResData>) =>
  useMutation<CreateTeamResData, CreateTeamError, UseCreateTeamVariables>(createTeam, opt)

// add team members
type UseAddTeamMembersArgs = AddTeamMembersArgs
export const useAddTeamMembers = (opt?: MutOpt<AddTeamMembersResData>) =>
  useMutation<AddTeamMembersResData, AddTeamMembersError, UseAddTeamMembersArgs>(
    addTeamMembers,
    opt
  )
