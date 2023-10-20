import sendRequest, { APIError } from '@/api/instance'
import { EnvChangelogItem, SecretsChange } from '@/types/envChangelog'

// NOTE: errors
type EnvChangelogErrorCode =
  | 'project_not_found'
  | 'environment_not_found'
  | 'change_not_found'
  | 'environment_already_exists'
  | 'environment_locked'

export type EnvChangelogError<T extends EnvChangelogErrorCode | void> = APIError<T>

export function envChangelogErrorMsgFromCode(
  code: EnvChangelogErrorCode | 'workspace_not_found'
): string {
  let msg = ''

  if (code === 'project_not_found') {
    msg = 'Project not found'
  }

  if (code === 'environment_not_found') {
    msg = 'Environment not found'
  }

  if (code === 'environment_already_exists') {
    msg = 'Environment with selected name already exists'
  }

  if (code === 'environment_locked') {
    msg =
      'Environment is locked. This particual revert action is allowed only for unlocked environments.'
  }

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (msg === '') msg = 'Something went wrong'

  return msg
}

// NOTE: requests
// list
export type GetEnvChangelogItemsError = EnvChangelogError<
  'project_not_found' | 'environment_not_found'
>
export type GetEnvChangelogItemsData = {
  hasMore: boolean
  data: EnvChangelogItem[]
}

export async function getEnvChangelogItems(args: {
  workspaceId: string
  projectName: string
  envName: string
  params?: {
    id: string
    date: string
    ['only-secrets']?: boolean
  }
}) {
  const { workspaceId, projectName, envName, params } = args

  const response = sendRequest<GetEnvChangelogItemsData>({
    params,
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/changelog`,
  })
  return await response
}

// get secrets
export type GetEnvChangelogItemSecretsError = EnvChangelogError<
  'project_not_found' | 'environment_not_found' | 'change_not_found'
>
export type GetEnvChangelogItemSecretsData = Array<SecretsChange>

export type GetEnvChangelogItemSecretsReqArgs = {
  workspaceId: string
  projectName: string
  envName: string
  changeId: string
}

export async function getEnvChangelogItemSecrets(args: GetEnvChangelogItemSecretsReqArgs) {
  const { workspaceId, projectName, envName, changeId } = args

  const response = sendRequest<GetEnvChangelogItemSecretsData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/changelog/${changeId}/secrets`,
  })
  return await response
}

// rollback
export type RevertEnvChangelogError = EnvChangelogError<
  'project_not_found' | 'environment_not_found' | 'change_not_found' | 'environment_locked'
>
export type RevertEnvChangelogResData = EnvChangelogItem | undefined

export type RevertEnvChangeReqArgs = {
  workspaceId: string
  projectName: string
  envName: string
  changeId: string
}

export async function revertEnvChange(args: RevertEnvChangeReqArgs) {
  const { workspaceId, projectName, envName, changeId } = args

  const response = sendRequest<RevertEnvChangelogResData>({
    method: 'POST',
    basePath: 'workspaces',
    // path: `${workspaceId}/projects/${projectName}/environments/${envName}/changelog/${changeId}/rollback`,
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/changelog/${changeId}/revert`,
  })
  return await response
}
