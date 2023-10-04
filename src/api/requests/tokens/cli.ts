import sendRequest, { APIError } from '@/api/instance'
import { CliToken } from '@/types/tokens/cli'

// TODO: errors
export type GetCliTokensError = APIError<'Workspace not found' | 'User not found'>
export type GetCliTokensData = Array<CliToken>

export async function getCliTokens(workspaceId: string) {
  const response = sendRequest<GetCliTokensData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/tokens/cli`,
  })
  return await response
}

// revoke (delete)
export type RevokeCliTokenError = APIError<'Workspace not found' | 'Token not found'>
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
