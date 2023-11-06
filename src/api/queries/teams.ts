import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetTeamArgs,
  GetTeamData,
  GetTeamError,
  GetTeamMembersArgs,
  GetTeamMembersData,
  GetTeamMembersError,
  GetTeamsArgs,
  GetTeamsData,
  GetTeamsError,
  getTeam,
  getTeamMembers,
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

export const useSearchTeams = (
  args: Required<Pick<UseGetTeamsArgs, 'workspaceId' | 'search'>> & { project?: string },
  opt?: UseQueryOptions<GetTeamsData, GetTeamsError>
) =>
  useQuery<GetTeamsData, GetTeamsError>(
    ['workspace-teams', args.workspaceId, args.search],
    () => {
      return getTeams(args)
    },
    opt
  )

//

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

//
type UseGetTeamMembersArg = GetTeamMembersArgs

export const useGetTeamMembers = (
  args: UseGetTeamMembersArg,
  opt?: UseQueryOptions<GetTeamMembersData, GetTeamMembersError>
) =>
  useQuery<GetTeamMembersData, GetTeamMembersError>(
    [
      'workspace',
      args.workspaceId,
      'team-members',
      args.teamId,
      args.pageSize,
      args.page,
      args.sort,
      args.desc,
      args.search,
    ],
    () => {
      return getTeamMembers(args)
    },
    opt
  )
