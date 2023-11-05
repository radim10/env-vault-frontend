import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetProjectAccessTeamsArgs,
  GetProjectAccessTeamsData,
  GetProjectAccessTeamsError,
  getProjectAccessTeams,
} from '../requests/projectAccess'

export const useGetProjectAccessTeams = (
  args: GetProjectAccessTeamsArgs,
  opt?: UseQueryOptions<GetProjectAccessTeamsData, GetProjectAccessTeamsError>
) =>
  useQuery<GetProjectAccessTeamsData, GetProjectAccessTeamsError>(
    ['workspace', args.workspaceId, 'project', args.projectName, 'access', 'teams'],
    () => {
      return getProjectAccessTeams(args)
    },
    opt
  )
