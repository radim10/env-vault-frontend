import sendRequest, { APIError } from '@/api/instance'
import { Environment, EnvironmentType } from '@/types/environments'

export type GetEnvironmentError = RenameEnvironmentError
export type GetEnvironmentData = Environment

export async function getEnvironment(args: {
  workspaceId: string
  projectName: string
  envName: string
}) {
  const { workspaceId, projectName, envName } = args

  const response = sendRequest<GetEnvironmentData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}`,
  })
  return await response
}

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

// lock/unlock
// TODO: errors
export type LockEnvironmentError = APIError<any>
export type LockEnvironmentResData = undefined

export async function lockEnvironment(args: {
  workspaceId: string
  projectName: string
  envName: string
  lock: boolean
}) {
  const { workspaceId, projectName, envName, lock } = args

  const response = sendRequest<LockEnvironmentResData>({
    method: 'PATCH',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/${
      lock ? 'lock' : 'unlock'
    }`,
  })
  return await response
}

// TODO: error
export type UpdateEnvironmentTypeError = RenameEnvironmentError
export type UpdateEnvironmentTypeResData = undefined

export async function updateEnvironmentType(args: {
  workspaceId: string
  projectName: string
  envName: string
  data: {
    type: EnvironmentType
  }
}) {
  const { workspaceId, projectName, envName, data } = args

  const response = sendRequest<UpdateEnvironmentTypeResData>({
    method: 'PATCH',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/type`,
    body: data,
  })
  return await response
}

// delete

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
