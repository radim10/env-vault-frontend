import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { getWorkspace, GetWorkspaceData, GetWorkspaceError } from '../requests/workspaces'

export const useGetWorkspace = (
  id: string,
  opt?: UseQueryOptions<GetWorkspaceData, GetWorkspaceError>
) =>
  useQuery<GetWorkspaceData, GetWorkspaceError>(
    ['workspace', id],
    () => {
      return getWorkspace(id)
    },
    opt
  )
