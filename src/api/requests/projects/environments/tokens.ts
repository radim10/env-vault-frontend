import sendRequest, { APIError } from '@/api/instance'
import { RenameEnvironmentError } from './environments'
import { EnvTokenPermission, EnvironmentToken } from '@/types/tokens/environment'
import { FullToken } from '@/types/tokens/token'

// NOTE: error
type EnvTokensErrorCode = 'project_not_found' | 'environment_not_found' | 'token_not_found'
export type EnvTokensError<T extends EnvTokensErrorCode | void> = APIError<T>

export function envTokensErrorMsgFromCode(
  code?: EnvTokensErrorCode | 'workspace_not_found'
): string {
  let msg = ''

  switch (code) {
    case 'token_not_found':
      msg = 'Token not found'
      break
    case 'project_not_found':
      msg = 'Project not found'
      break
    case 'environment_not_found':
      msg = 'Environment not found'
      break
    case 'workspace_not_found':
      msg = 'Workspace has been deleted'
      break
    default:
      msg = 'Something went wrong'
  }

  return msg
}

// NOTE: requests
export type CreateEnvironmentTokenError = EnvTokensError<
  'project_not_found' | 'environment_not_found'
>
export type CreateEnvironmentTokenResData = { id: string; token: string }

export interface CreateEnvironmentTokenArgs {
  workspaceId: string
  projectName: string
  envName: string
  data: {
    name: string
    permissions: EnvTokenPermission[]
    expiration?: {
      hours?: number
      days?: number
    }
  }
}
export async function createEnvironmentToken(args: CreateEnvironmentTokenArgs) {
  const { workspaceId, projectName, envName, data } = args

  const response = sendRequest<CreateEnvironmentTokenResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/tokens`,
    body: data,
  })
  return await response
}

export type GetEnvironmentTokensError = RenameEnvironmentError
export type GetEnvironmentTokensData = EnvironmentToken[]

export type GetEnvironmentTokensArgs = Pick<
  CreateEnvironmentTokenArgs,
  'workspaceId' | 'projectName' | 'envName'
>

export async function getEnvironmentTokens(args: GetEnvironmentTokensArgs) {
  const { workspaceId, projectName, envName } = args

  const response = sendRequest<GetEnvironmentTokensData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/tokens`,
  })
  return await response
}

// get single
export type GetEnvironmentTokenError = EnvTokensError<
  'project_not_found' | 'environment_not_found' | 'token_not_found'
>
export type GetEnvironmentTokenData = FullToken

export type GetEnvironmentTokenArgs = Pick<
  CreateEnvironmentTokenArgs,
  'workspaceId' | 'projectName' | 'envName'
> & { tokenId: string }

export async function getEnvironmentToken(args: GetEnvironmentTokenArgs) {
  const { workspaceId, projectName, envName, tokenId } = args

  const response = sendRequest<GetEnvironmentTokenData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/tokens/${tokenId}`,
  })
  return await response
}

//

// revoke (delete)
export type RevokeEnvironmentTokenError = EnvTokensError<
  'project_not_found' | 'environment_not_found' | 'token_not_found'
>
export type RevokeEnvironmentTokenResData = undefined

export type RevokeEnvironmentTokenArgs = Pick<
  CreateEnvironmentTokenArgs,
  'workspaceId' | 'projectName' | 'envName'
> & { tokenId: string }

export async function revokeEnvironmentToken(args: RevokeEnvironmentTokenArgs) {
  const { workspaceId, projectName, envName, tokenId } = args

  const response = sendRequest<RevokeEnvironmentTokenResData>({
    method: 'DELETE',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/tokens/${tokenId}`,
  })
  return await response
}
