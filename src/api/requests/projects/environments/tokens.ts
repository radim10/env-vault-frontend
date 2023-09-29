import sendRequest, { APIError } from '@/api/instance'
import { RenameEnvironmentError } from './environments'
import { EnvTokenGrant, EnvironmentToken } from '@/types/environmentTokens'

export type CreateEnvironmentTokenError = RenameEnvironmentError
export type CreateEnvironmentTokenResData = { token: string }

export interface CreateEnvironmentTokenArgs {
  workspaceId: string
  projectName: string
  envName: string
  data: {
    name: string
    grant: EnvTokenGrant
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
