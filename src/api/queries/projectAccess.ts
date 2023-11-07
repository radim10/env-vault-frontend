import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetProjectAccessTeamsArgs,
  GetProjectAccessTeamsData,
  GetProjectAccessTeamsError,
  GetProjectAccessUsersArgs,
  GetProjectAccessUsersData,
  GetProjectAccessUsersError,
  SearchSelectProjectAccessTeamsData,
  SearchSelectProjectAccessTeamsError,
  SearchSelectProjectAccessTemsArgs,
  SearchSelectProjectAccessUsersArgs,
  SearchSelectProjectAccessUsersData,
  SearchSelectProjectAccessUsersError,
  getProjectAccessTeams,
  getProjectAccessUsers,
  searchSelectProjectAccessTeams,
  searchSelectProjectAccessUsers,
} from '../requests/projectAccess'

export const useGetProjectAccessTeams = (
  args: GetProjectAccessTeamsArgs,
  opt?: UseQueryOptions<GetProjectAccessTeamsData, GetProjectAccessTeamsError>
) =>
  useQuery<GetProjectAccessTeamsData, GetProjectAccessTeamsError>(
    ['workspace', args.workspaceId, 'project', args.projectName, 'access', 'teams'],
    () => getProjectAccessTeams(args),
    opt
  )

// users
export const useGetProjectAccessUsers = (
  args: GetProjectAccessUsersArgs,
  opt?: UseQueryOptions<GetProjectAccessUsersData, GetProjectAccessUsersError>
) => {
  return useQuery<GetProjectAccessUsersData, GetProjectAccessUsersError>(
    ['workspace', args.workspaceId, 'project', args.projectName, 'access', 'users'],
    () => getProjectAccessUsers(args),
    opt
  )
}

// search teams for combobox
export const useSearchSelectProjectAccessTeams = (
  args: SearchSelectProjectAccessTemsArgs,
  opt?: UseQueryOptions<SearchSelectProjectAccessTeamsData, SearchSelectProjectAccessTeamsError>
) => {
  return useQuery<SearchSelectProjectAccessTeamsData, SearchSelectProjectAccessTeamsError>(
    ['workspace-teams', args.workspaceId, args.search, 'project', args.projectName],
    () => searchSelectProjectAccessTeams(args),
    opt
  )
}

// search users for combobox
export const useSearchSelectProjectAccessUsers = (
  args: SearchSelectProjectAccessUsersArgs,
  opt?: UseQueryOptions<SearchSelectProjectAccessUsersData, SearchSelectProjectAccessUsersError>
) => {
  return useQuery<SearchSelectProjectAccessUsersData, SearchSelectProjectAccessUsersError>(
    ['workspace', args.workspaceId, 'users-search', args.value, 'project', args.projectName],
    () => searchSelectProjectAccessUsers(args),
    opt
  )
}
