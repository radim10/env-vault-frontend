import sendRequest, { APIError } from '@/api/instance'

// TODO: error
export type CreateEnvironmentError = APIError<
  'Workspace not found' | 'Project not found' | 'Environment not found'
>
export type CreateEnvironmentResData = undefined

export async function createEnvironment(args: {
  workspaceId: string
  projectName: string
  data: {
    name: string
  }
}) {
  const { workspaceId, projectName, data } = args

  const response = sendRequest<CreateEnvironmentResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments`,
    body: data,
  })
  return await response
}

// TODO: error
export type RenameEnvironmentError = APIError<
  | 'Workspace not found'
  | 'Project not found'
  | 'Environment not found'
  | 'Environment already exists'
>
export type RenameEnvironmentResData = undefined

export async function renameEnvironment(args: {
  workspaceId: string
  projectName: string
  envName: string
  data: {
    name: string
  }
}) {
  const { workspaceId, projectName, envName, data } = args

  const response = sendRequest<RenameEnvironmentResData>({
    method: 'PATCH',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/rename`,
    body: data,
  })
  return await response
}

export type DeleteEnvironmentError = APIError<
  'Workspace not found' | 'Project not found' | 'Environment not found'
>
export type DeleteEnvironmentResData = undefined

export async function deleteEnvironment(args: {
  workspaceId: string
  projectName: string
  envName: string
}) {
  const { workspaceId, projectName, envName } = args

  const response = sendRequest<DeleteEnvironmentResData>({
    method: 'DELETE',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}`,
  })
  return await response
}
