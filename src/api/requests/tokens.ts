import { EnvTokenGrant, ReadOnlyEnvToken } from '@/types/tokens/environment'
import sendRequest, { APIError } from '../instance'
import { WorkspaceToken, WorkspaceTokenPermissions } from '@/types/tokens/workspace'
import { FullToken } from '@/types/tokens/token'

// NOTE: error
type TokensErrorCode =
  | 'workspace_not_found'
  | 'user_not_found'
  | 'token_not_found'
  | 'missing_permission'
export type TokensError<T extends TokensErrorCode | void> = APIError<T>

export function tokensErrorMsgFromCode(
  code?: TokensErrorCode | 'workspace_not_found'
): string | null {
  let msg = null

  if (code === 'workspace_not_found') {
    msg = 'Current workspace not found'
  }

  if (code === 'token_not_found') {
    msg = 'Token not found'
  }

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (code === 'user_not_found') {
    msg = 'Current user not found'
  }

  if (code === 'missing_permission') {
    msg = 'You do not have permission to perform this action'
  }

  return msg
}

// NOTE: requests
export type GetEnvTokensError = TokensError<undefined>
export type GetEnvTokensData = Awaited<ReturnType<typeof getEnvTokens>>

export async function getEnvTokens(args: { workspaceId: string }) {
  const { workspaceId } = args

  const response = sendRequest<Array<ReadOnlyEnvToken>>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/environments`,
  })
  return await response
}

// NOTE: workspaces
// get many
export type GetWorkspaceTokensError = TokensError<undefined>
export type GetWorkspaceTokensData = Array<WorkspaceToken>

export async function getWorkspaceTokens(args: { workspaceId: string }) {
  const { workspaceId } = args

  const response = sendRequest<GetWorkspaceTokensData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/workspace`,
  })
  return await response
}

// get full value
export type GetWorkspaceTokenError = TokensError<
  'user_not_found' | 'token_not_found' | 'workspace_not_found'
>
export type GetWorkspaceTokenData = FullToken

export async function getWorkspaceToken(args: { workspaceId: string; tokenId: string }) {
  const { workspaceId, tokenId } = args

  const response = sendRequest<GetWorkspaceTokenData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/workspace/${tokenId}`,
  })
  return await response
}

// create
export type CreateWorkspaceTokenError = TokensError<undefined>
export type CreateWorkspaceTokenResData = { id: string; token: string }

export interface CreateWorkspaceTokenArgs {
  workspaceId: string
  data: {
    name: string
    permissions: WorkspaceTokenPermissions
    expiration?: {
      hours?: number
      days?: number
    }
  }
}

export async function createWorkspaceToken(args: CreateWorkspaceTokenArgs) {
  const { workspaceId } = args

  const response = sendRequest<CreateWorkspaceTokenResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/workspace`,
    body: args?.data,
  })
  return await response
}

// revoke (delete)

// revoke (delete)
export type RevokeWorkspaceTokenError = TokensError<'token_not_found'>
export type RevokeWorkspaceTokenResData = undefined

export type RevokeWorkspaceTokenArgs = {
  workspaceId: string
  tokenId: string
}

export async function revokeWorkspaceToken(args: RevokeWorkspaceTokenArgs) {
  const { workspaceId, tokenId } = args

  const response = sendRequest<RevokeWorkspaceTokenResData>({
    method: 'DELETE',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/workspace/${tokenId}`,
  })
  return await response
}

// cli tokens
