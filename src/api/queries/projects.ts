import { getProjects, GetProjectsData, GetProjectsError } from '@/api/requests/projects'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

export const useGetProjects = (
  args: {
    workspaceId: string
  },
  opt?: UseQueryOptions<GetProjectsData, GetProjectsError>
) =>
  useQuery<GetProjectsData, GetProjectsError>(
    ['projects', args.workspaceId],
    () => {
      return getProjects(args)
    },
    opt
  )
