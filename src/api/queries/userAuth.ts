import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetAuthMethodsError,
  GetAuthMethodsResData,
  ListUserSessionsData,
  ListUserSessionsError,
  UserAuthError,
  getAuthMethods,
  listUserSessions,
} from '../requests/userAuth'

// TODO: key with user id?
export const useListUserSessions = (
  opt?: UseQueryOptions<ListUserSessionsData, ListUserSessionsError>
) => useQuery<ListUserSessionsData, ListUserSessionsError>(['sessions'], listUserSessions, opt)

export const useGetAuthMethods = (
  userId: string,
  opt?: UseQueryOptions<GetAuthMethodsResData, GetAuthMethodsError>
) => useQuery<GetAuthMethodsResData, GetAuthMethodsError>([userId, 'auth'], getAuthMethods, opt)
