import {
  checkProjectName,
  CheckProjectNameData,
  CheckProjectNameError,
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

export const useCheckProjectName = (
  args: {
    workspaceId: string
    name: string
  },
  opt?: UseQueryOptions<CheckProjectNameData, CheckProjectNameError>
) =>
  useQuery<CheckProjectNameData, CheckProjectNameError>(
    ['project-name', args.workspaceId, args.name],
    () => {
      return checkProjectName(args)
    },
    opt
  )
