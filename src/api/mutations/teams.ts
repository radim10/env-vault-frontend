import { CreateTeamArgs, CreateTeamError, CreateTeamResData, createTeam } from '../requests/teams'
import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'

// update role
type UseCreateTeamVariables = CreateTeamArgs

export const useCreateTeam = (opt?: MutOpt<CreateTeamResData>) =>
  useMutation<CreateTeamResData, CreateTeamError, UseCreateTeamVariables>(createTeam, opt)
