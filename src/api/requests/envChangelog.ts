import sendRequest, { APIError } from '@/api/instance'
import { EnvChangelogItem } from '@/types/envChangelog'

// NOTE: errors
type EnvChangelogErrorCode = 'project_not_found' | 'environment_not_found'

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
export type GetEnvChangelogError = EnvChangelogError<'project_not_found' | 'environment_not_found'>
export type GetEnvChangelogData = {
  hasMore: boolean
  data: EnvChangelogItem[]
}

export async function getEnvChangelog(args: {
  workspaceId: string
  projectName: string
  envName: string
}) {
  const { workspaceId, projectName, envName } = args

  const response = sendRequest<GetEnvChangelogData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/changelog`,
  })
  return await response
}
