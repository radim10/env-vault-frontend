import {
  UpdateTeamMembersArgs,
  UpdateTeamMembersError,
  UpdateTeamMembersResData,
  CreateTeamArgs,
  CreateTeamError,
  CreateTeamResData,
  updateTeamMembers,
  createTeam,
  UpdateTeamArgs,
  UpdateTeamResData,
  UpdateTeamError,
  updateTeam,
} from '../requests/teams'
import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'

// update role
type UseCreateTeamVariables = CreateTeamArgs

export const useCreateTeam = (opt?: MutOpt<CreateTeamResData>) =>
  useMutation<CreateTeamResData, CreateTeamError, UseCreateTeamVariables>(createTeam, opt)

// update team members
type UseUpdateTeamMembersArgs = UpdateTeamMembersArgs
export const useUpdateTeamMembers = (opt?: MutOpt<UpdateTeamMembersResData>) =>
  useMutation<UpdateTeamMembersResData, UpdateTeamMembersError, UseUpdateTeamMembersArgs>(
    updateTeamMembers,
    opt
  )

// update team
type UseUpdateTeamVariables = UpdateTeamArgs

export const useUpdateTeam = (opt?: MutOpt<UpdateTeamResData>) =>
  useMutation<UpdateTeamResData, UpdateTeamError, UseUpdateTeamVariables>(updateTeam, opt)
