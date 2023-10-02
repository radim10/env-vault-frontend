import { EnvTokenGrant, ReadOnlyEnvToken } from '@/types/environmentTokens'
import sendRequest, { APIError } from '../instance'
import { WorkspaceToken } from '@/types/workspaceTokens'

export type GetEnvTokensError = APIError<'Workspace not found'>
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
// get
export type GetWorkspaceTokensError = APIError<'Workspace not found'>
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

// create
export type CreateWorkspaceTokenError = APIError<'Workspace not found'>
export type CreateWorkspaceTokenResData = { id: string; token: string }

export interface CreateWorkspaceTokenArgs {
  workspaceId: string
  data: {
    name: string
    grant: EnvTokenGrant
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
export type RevokeWorkspaceTokenError = APIError<'Workspace not found' | 'Token not found'>
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
