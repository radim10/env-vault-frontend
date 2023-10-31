import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  CheckWorkspaceUserEmailArgs,
  CheckWorkspaceUserEmailError,
  CheckWorkspaceUserEmailResData,
  GetWorkspaceUsersArgs,
  GetWorkspaceUsersData,
  GetWorkspaceUsersError,
  ListWorkspaceInvitationsArgs,
  ListWorkspaceInvitationsData,
  ListWorkspaceInvitationsError,
  checkWorkspaceUserEmail,
  getWorkspaceUsers,
  listWorkspaceInvitations,
} from '../requests/users'

type UseGetWorkspaceUsersArgs = GetWorkspaceUsersArgs

export const useGetWorkspaceUsers = (
  args: UseGetWorkspaceUsersArgs,
  opt?: UseQueryOptions<GetWorkspaceUsersData, GetWorkspaceUsersError>
) =>
  useQuery<GetWorkspaceUsersData, GetWorkspaceUsersError>(
    ['workspace', args.workspaceId, 'users', args.pageSize, args.page, args.sort, args.desc, args.search],
    () => {
      return getWorkspaceUsers(args)
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
