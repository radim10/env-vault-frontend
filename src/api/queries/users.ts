import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  CheckWorkspaceUserEmailArgs,
  CheckWorkspaceUserEmailError,
  CheckWorkspaceUserEmailResData,
  GetWorkspaceUsersArgs,
  GetWorkspaceUsersData,
  GetWorkspaceUsersError,
  checkWorkspaceUserEmail,
  getWorkspaceUsers,
} from '../requests/users'

type UseGetWorkspaceUsersArgs = GetWorkspaceUsersArgs

export const useGetWorkspaceUsers = (
  args: UseGetWorkspaceUsersArgs,
  opt?: UseQueryOptions<GetWorkspaceUsersData, GetWorkspaceUsersError>
) =>
  useQuery<GetWorkspaceUsersData, GetWorkspaceUsersError>(
    ['workspace', args.workspaceId, 'users', args.page, args.sort, args.desc, args.search],
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
