import { EnvTokenGrant, ReadOnlyEnvToken } from '@/types/environmentTokens'
import sendRequest, { APIError } from '../instance'

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
