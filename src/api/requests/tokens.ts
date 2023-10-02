import { EnvironmentToken, ReadOnlyEnvToken } from '@/types/environmentTokens'
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
