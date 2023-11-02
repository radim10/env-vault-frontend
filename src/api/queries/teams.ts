import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetTeamArgs,
  GetTeamData,
  GetTeamError,
  GetTeamsArgs,
  GetTeamsData,
  GetTeamsError,
  getTeam,
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

// get single
type UseGetTeamArgs = GetTeamArgs

export const useGetTeam = (
  args: UseGetTeamArgs,
  opt?: UseQueryOptions<GetTeamData, GetTeamError>
) =>
  useQuery<GetTeamData, GetTeamError>(
    ['workspace-team', args.workspaceId, args.teamId],
    () => {
      return getTeam(args)
    },
    opt
  )
