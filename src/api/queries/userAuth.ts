import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { ListUserSessionsData, ListUserSessionsError, listUserSessions } from '../requests/userAuth'

export const useListUserSessions = (
  opt?: UseQueryOptions<ListUserSessionsData, ListUserSessionsError>
) => useQuery<ListUserSessionsData, ListUserSessionsError>(['sessions'], listUserSessions, opt)
