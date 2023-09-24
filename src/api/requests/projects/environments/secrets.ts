import sendRequest, { APIError } from '@/api/instance'
import { Secret, UpdatedSecretsBody } from '@/types/secrets'
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
export type GetSecretsError = APIError<
  'Workspace not found' | 'Project not found' | 'Environment not found' | 'Out of sync'
>
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
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/secrets`,
  })
  return await response
}

export type UpdateSecretsError = APIError<
  'Workspace not found' | 'Project not found' | 'Out of sync'
>
export type UpdateSecretsResData = Awaited<ReturnType<typeof updateSecrets>>

export async function updateSecrets(args: {
  workspaceId: string
  projectName: string
  envName: string
  data: UpdatedSecretsBody
}) {
  const { workspaceId, projectName, envName, data } = args

  const response = sendRequest<undefined>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/secrets`,
    body: data,
  })
  return await response
}
