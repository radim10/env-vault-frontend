import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetWorkspaceUsersArgs,
  GetWorkspaceUsersData,
  GetWorkspaceUsersError,
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
