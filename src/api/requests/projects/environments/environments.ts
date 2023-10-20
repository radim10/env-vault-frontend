import sendRequest, { APIError } from '@/api/instance'
import { Environment, EnvironmentType } from '@/types/environments'
import { ListEnvironment } from '@/types/projects'

// NOTE: errors
type EnvErrorCode =
  | 'project_not_found'
  | 'environment_not_found'
  | 'environment_already_exists'
  | 'environment_locked'

export type EnvError<T extends EnvErrorCode | void> = APIError<T>

export function envErrorMsgFromCode(code: EnvErrorCode | 'workspace_not_found'): string {
  let msg = ''

  if (code === 'project_not_found') {
    msg = 'Project not found'
  }
  if (code === 'environment_not_found') {
    msg = 'Environment not found'
  }
  if (code === 'environment_locked') {
    msg = 'Environment is locked'
  }
  if (code == 'environment_already_exists') {
    msg = 'Environment already exists'
  }

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  return msg
}

// NOTE: requests
export type GetEnvironmentError = EnvError<'project_not_found' | 'environment_not_found'>
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

// get multiuple environments
export type GetEnvironmentsError = EnvError<'project_not_found'>
export type GetEnvironmentsData = ListEnvironment[]

export async function getEnvironments(args: { workspaceId: string; projectName: string }) {
  const { workspaceId } = args

  const response = sendRequest<GetEnvironmentsData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${args.projectName}/environments`,
  })
  return await response
}

// TODO: error
export type CreateEnvironmentError = EnvError<'project_not_found' | 'environment_already_exists'>
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
export type RenameEnvironmentError = EnvError<
  'project_not_found' | 'environment_not_found' | 'environment_already_exists'
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
export type LockEnvironmentError = EnvError<'project_not_found' | 'environment_not_found'>
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
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/${lock ? 'lock' : 'unlock'
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

export type DeleteEnvironmentError = EnvError<'project_not_found' | 'environment_not_found'>
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
