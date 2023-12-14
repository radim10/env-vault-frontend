import sendRequest, { APIError } from '@/api/instance'
import { Secret, UpdatedSecretsBody } from '@/types/secrets'

type SecretsErrorCode =
  | 'project_not_found'
  | 'environment_not_found'
  | 'out_of_sync'
  | 'missing_permission'
export type SecretsError<T extends SecretsErrorCode | void> = APIError<T>

export function secretsErrorMsgFromCode(
  code?: SecretsErrorCode | 'workspace_not_found'
): string | null {
  let msg = null

  if (code === 'project_not_found') {
    msg = 'Project not found'
  }

  if (code === 'out_of_sync') {
    msg = 'Cannot save because secrets has beenm updated in the meantime'
  }

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (code === 'missing_permission') {
    msg = "You don't have permission to perform this action"
  }

  return msg
}

// TODO: error
export type GetSecretsError = SecretsError<'project_not_found' | 'environment_not_found'>
export type GetSecretsData = Array<Secret>

export async function getSecrets(args: {
  workspaceId: string
  projectName: string
  envName: string
}) {
  const { workspaceId, projectName, envName } = args

  const response = sendRequest<GetSecretsData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/secrets`,
  })
  return await response
}

export type UpdateSecretsError = SecretsError<
  'project_not_found' | 'environment_not_found' | 'out_of_sync'
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
