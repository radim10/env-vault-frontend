import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { ListUserSessionsData, ListUserSessionsError, listUserSessions } from '../requests/userAuth'

// TODO: key with user id?
export const useListUserSessions = (
  opt?: UseQueryOptions<ListUserSessionsData, ListUserSessionsError>
) => useQuery<ListUserSessionsData, ListUserSessionsError>(['sessions'], listUserSessions, opt)
