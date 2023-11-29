import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetCurrentUserArgs,
  GetCurrentUserData,
  GetCurrentUserError,
  ListUserWorkspacesData,
  ListUserWorkspacesError,
  getCurrentUser,
  listUserWorkspaces,
} from '../requests/currentUser'

export const useGetCurrentUser = (
  args: GetCurrentUserArgs,
  opt?: UseQueryOptions<GetCurrentUserData, GetCurrentUserError>
) =>
  useQuery<GetCurrentUserData, GetCurrentUserError>(
    ['current-user'],
    () => {
      return getCurrentUser(args)
    },
    opt
  )

export const useListUserWorkspaces = (
  args: { userId: string },
  opt?: UseQueryOptions<ListUserWorkspacesData, ListUserWorkspacesError>
) =>
  useQuery<ListUserWorkspacesData, ListUserWorkspacesError>(
    [args.userId, 'user-workspaces'],
    listUserWorkspaces,
    opt
  )
