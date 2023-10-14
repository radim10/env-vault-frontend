import sendRequest, { APIError } from '@/api/instance'
import { EnvChangelogItem, SecretsChange } from '@/types/envChangelog'

// NOTE: errors
type EnvChangelogErrorCode = 'project_not_found' | 'environment_not_found' | 'change_not_found'

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

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

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
export type RollbackEnvChangelogError = EnvChangelogError<
  'project_not_found' | 'environment_not_found' | 'change_not_found'
>
export type RollbackEnvChangelogResData = EnvChangelogItem | undefined

export type RollbackEnvChangeReqArgs = {
  workspaceId: string
  projectName: string
  envName: string
  changeId: string
}

export async function rollbackEnvChangelog(args: RollbackEnvChangeReqArgs) {
  const { workspaceId, projectName, envName, changeId } = args

  const response = sendRequest<RollbackEnvChangelogResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/changelog/${changeId}/rollback`,
  })
  return await response
}
