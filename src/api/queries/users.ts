import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { GetWorkspaceUsersData, GetWorkspaceUsersError, getWorkspaceUsers } from '../requests/users'

export const useGetWorkspaceUsers = (
  workspaceId: string,
  opt?: UseQueryOptions<GetWorkspaceUsersData, GetWorkspaceUsersError>
) =>
  useQuery<GetWorkspaceUsersData, GetWorkspaceUsersError>(
    ['workspace', workspaceId, 'users'],
    () => {
      return getWorkspaceUsers(workspaceId)
    },
    opt
  )
