import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetAuthMethodsError,
  GetAuthMethodsResData,
  GetPendingEmailError,
  GetPendingEmailResData,
  ListUserSessionsData,
  ListUserSessionsError,
  getAuthMethods,
  getPendingEmail,
  listUserSessions,
} from '../requests/userAuth'

// TODO: key with user id?
export const useListUserSessions = (
  opt?: UseQueryOptions<ListUserSessionsData, ListUserSessionsError>
) => useQuery<ListUserSessionsData, ListUserSessionsError>(['sessions'], listUserSessions, opt)

export const useGetAuthMethods = (
  userId: string,
  opt?: UseQueryOptions<GetAuthMethodsResData, GetAuthMethodsError>
) =>
  useQuery<GetAuthMethodsResData, GetAuthMethodsError>(
    [userId, 'auth-methods'],
    getAuthMethods,
    opt
  )

// get pending email
export const useGetPendingEmail = (
  userId: string,
  opt?: UseQueryOptions<GetPendingEmailResData, GetPendingEmailError>
) =>
  useQuery<GetPendingEmailResData, GetPendingEmailError>(
    [userId, 'pending-email'],
    getPendingEmail,
    opt
  )
