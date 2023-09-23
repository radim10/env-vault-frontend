import {
  getProject,
  GetProjectData,
  GetProjectError,
  getProjects,
  GetProjectsData,
  GetProjectsError,
} from '@/api/requests/projects/root'
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

export const useGetProject = (
  args: {
    workspaceId: string
    projectName: string
  },
  opt?: UseQueryOptions<GetProjectData, GetProjectError>
) =>
  useQuery<GetProjectData, GetProjectError>(
    ['project', args.workspaceId, args.projectName],
    () => {
      return getProject(args)
    },
    opt
  )
