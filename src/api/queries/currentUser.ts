import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetCurrentUserArgs,
  GetCurrentUserData,
  GetCurrentUserError,
  getCurrentUser,
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
