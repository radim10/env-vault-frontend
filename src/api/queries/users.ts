import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  CheckWorkspaceUserEmailArgs,
  CheckWorkspaceUserEmailError,
  CheckWorkspaceUserEmailResData,
  GetUserAccessProjectsArgs,
  GetUserAccessProjectsData,
  GetUserAccessProjectsError,
  GetUserAccessTeamProjectsArgs,
  GetUserAccessTeamProjectsData,
  GetUserAccessTeamProjectsError,
  GetUserTeamsArgs,
  GetUserTeamsData,
  GetUserTeamsError,
  GetWorkspaceUserArgs,
  GetWorkspaceUserData,
  GetWorkspaceUserError,
  GetWorkspaceUsersArgs,
  GetWorkspaceUsersData,
  GetWorkspaceUsersError,
  ListWorkspaceInvitationsArgs,
  ListWorkspaceInvitationsData,
  ListWorkspaceInvitationsError,
  SearchWorkspaceUsersArgs,
  SearchWorkspaceUsersData,
  SearchWorkspaceUsersError,
  checkWorkspaceUserEmail,
  getUserAccessProjects,
  getUserAccessTeamProjects,
  getUserTeams,
  getWorkspaceUser,
  getWorkspaceUsers,
  listWorkspaceInvitations,
  searchWorkspaceUsers,
} from '../requests/users'

type UserGetWorkspaceUserArg = GetWorkspaceUserArgs

export const useGetWorkspaceUser = (
  args: UserGetWorkspaceUserArg,
  opt?: UseQueryOptions<GetWorkspaceUserData, GetWorkspaceUserError>
) =>
  useQuery<GetWorkspaceUserData, GetWorkspaceUserError>(
    ['workspace', args.workspaceId, 'user', args.userId],
    () => {
      return getWorkspaceUser(args)
    },
    opt
  )

// get user team memberships

export const useGetUserTeams = (
  args: GetUserTeamsArgs,
  opt?: UseQueryOptions<GetUserTeamsData, GetUserTeamsError>
) =>
  useQuery<GetUserTeamsData, GetUserTeamsError>(
    ['workspace', args.workspaceId, 'user', args.userId, 'teams'],
    () => {
      return getUserTeams(args)
    },
    opt
  )

export const useGetUserAccessProjects = (
  args: GetUserAccessProjectsArgs,
  opt?: UseQueryOptions<GetUserAccessProjectsData, GetUserAccessProjectsError>
) =>
  useQuery<GetUserAccessProjectsData, GetUserAccessProjectsError>(
    ['workspace', args.workspaceId, 'user', args.userId, 'access-user'],
    () => {
      return getUserAccessProjects(args)
    },
    opt
  )

export const useGetUserAccessTeamProjects = (
  args: GetUserAccessTeamProjectsArgs,
  opt?: UseQueryOptions<GetUserAccessTeamProjectsData, GetUserAccessTeamProjectsError>
) =>
  useQuery<GetUserAccessTeamProjectsData, GetUserAccessTeamProjectsError>(
    ['workspace', args.workspaceId, 'user', args.userId, 'access-team'],
    () => {
      return getUserAccessTeamProjects(args)
    },
    opt
  )

//

type UseGetWorkspaceUsersArgs = GetWorkspaceUsersArgs

export const useGetWorkspaceUsers = (
  args: UseGetWorkspaceUsersArgs,
  opt?: UseQueryOptions<GetWorkspaceUsersData, GetWorkspaceUsersError>
) =>
  useQuery<GetWorkspaceUsersData, GetWorkspaceUsersError>(
    [
      'workspace',
      args.workspaceId,
      'users',
      args.pageSize,
      args.page,
      args.sort,
      args.desc,
      args.search,
    ],
    () => {
      return getWorkspaceUsers(args)
    },
    opt
  )

// search
type UseSearchWorkspaceUsersArgs = SearchWorkspaceUsersArgs

export const useSearchWorkspaceUsers = (
  args: UseSearchWorkspaceUsersArgs,
  opt?: UseQueryOptions<SearchWorkspaceUsersData, SearchWorkspaceUsersError>
) =>
  useQuery<SearchWorkspaceUsersData, SearchWorkspaceUsersError>(
    ['workspace', args.workspaceId, 'users-search', args.value],
    () => {
      return searchWorkspaceUsers(args)
    },
    opt
  )

// check workspace user email
type UseCheckWorkspaceUserEmailArgs = CheckWorkspaceUserEmailArgs

export const useCheckWorkspaceUserEmail = (
  args: UseCheckWorkspaceUserEmailArgs,
  opt?: UseQueryOptions<CheckWorkspaceUserEmailResData, CheckWorkspaceUserEmailError>
) =>
  useQuery<CheckWorkspaceUserEmailResData, CheckWorkspaceUserEmailError>(
    ['workspace', args.workspaceId, 'users', args.email],
    () => {
      return checkWorkspaceUserEmail(args)
    },
    opt
  )

//
// // list workspace invitations
// export const useListWorkspaceInvitations = (
//   args: ListWorkspaceInvitationsArgs,
//   opt?: UseQueryOptions<ListWorkspaceInvitationsData, ListWorkspaceInvitationsError>
// ) =>
//   useQuery<ListWorkspaceInvitationsData, ListWorkspaceInvitationsError>(
//     ['workspace-invitations', args.workspaceId, {
//       page: args.page,
//       sort: args.sort,
//       desc: args.desc,
//       search: args.search,
//     }],
//     () => {
//       return listWorkspaceInvitations(args)
//     },
//     opt
//   )

// list workspace invitations
export const useListWorkspaceInvitations = (
  args: ListWorkspaceInvitationsArgs,
  opt?: UseQueryOptions<ListWorkspaceInvitationsData, ListWorkspaceInvitationsError>
) =>
  useQuery<ListWorkspaceInvitationsData, ListWorkspaceInvitationsError>(
    ['workspace-invitations', args.workspaceId],
    () => {
      return listWorkspaceInvitations(args)
    },
    opt
  )
