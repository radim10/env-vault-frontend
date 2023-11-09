import sendRequest, { APIError } from '@/api/instance'
import { CliToken } from '@/types/tokens/cli'

type CliTokensErrorCode = 'token_not_found' | 'user_not_found'
export type CliTokensError<T extends CliTokensErrorCode | void> = APIError<T>

export function cliTokensErrorMsgFromCode(
  code?: CliTokensErrorCode | 'workspace_not_found'
): string | null {
  let msg = null

  if (code === 'token_not_found') {
    msg = 'Token not found'
  }

  if (code === 'user_not_found') {
    msg = 'Current user not found'
  }

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  return msg
}

// TODO: errors
export type GetCliTokensError = CliTokensError<'user_not_found'>
export type GetCliTokensData = Array<CliToken>

export async function getCliTokens(workspaceId: string) {
  const response = sendRequest<GetCliTokensData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/cli`,
  })
  return await response
}

// create
export type CreateCliTokenError = CliTokensError<'user_not_found'>
export type CreateCliTokenResData = { id: string; value: string }

export type CreateCliTokenArgs = {
  workspaceId: string
  name: string
}

export async function createCliToken(args: CreateCliTokenArgs) {
  const { workspaceId } = args

  const response = sendRequest<CreateCliTokenResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/cli`,
    body: { name: args.name },
  })

  return await response
}

// revoke (delete)
export type RevokeCliTokenError = CliTokensError<'token_not_found'>
export type RevokeCliTokenResData = undefined

export type RevokeCliTokenArgs = {
  workspaceId: string
  tokenId: string
}

export async function revokeCliToken(args: RevokeCliTokenArgs) {
  const { workspaceId, tokenId } = args

  const response = sendRequest<RevokeCliTokenResData>({
    method: 'DELETE',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/cli/${tokenId}`,
  })

  return await response
}
