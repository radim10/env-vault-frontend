import sendRequest, { APIError } from '@/api/instance'
import { Secret } from '@/types/secrets'
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

// TODO: error
export type GetSecretsError = APIError<'Workspace not found'>
export type GetSecretsData = Awaited<ReturnType<typeof getSecrets>>

export async function getSecrets(args: {
  workspaceId: string
  projectName: string
  envName: string
}) {
  const { workspaceId, projectName, envName } = args

  const response = sendRequest<Array<Secret>>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/env/${envName}/secrets`,
  })
  return await response
}
