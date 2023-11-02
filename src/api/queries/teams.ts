import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  CreateTeamArgs,
  CreateTeamError,
  CreateTeamResData,
  GetTeamsArgs,
  GetTeamsData,
  GetTeamsError,
  getTeams,
} from '../requests/teams'

type UseGetTeamsArgs = GetTeamsArgs

export const useGetTeams = (
  args: UseGetTeamsArgs,
  opt?: UseQueryOptions<GetTeamsData, GetTeamsError>
) =>
  useQuery<GetTeamsData, GetTeamsError>(
    ['workspace-teams', args.workspaceId],
    () => {
      return getTeams(args)
    },
    opt
  )
