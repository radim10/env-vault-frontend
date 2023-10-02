import {
  getEnvTokens,
  GetEnvTokensData,
  GetEnvTokensError,
  getWorkspaceTokens,
  GetWorkspaceTokensData,
  GetWorkspaceTokensError,
} from '@/api/requests/tokens'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

export const useGetEnvTokens = (
  args: {
    workspaceId: string
  },
  opt?: UseQueryOptions<GetEnvTokensData, GetEnvTokensError>
) =>
  useQuery<GetEnvTokensData, GetEnvTokensError>(
    [args.workspaceId, 'env-tokens'],
    () => {
      return getEnvTokens(args)
    },
    opt
  )

//
export const useGetWorkspaceTokens = (
  args: {
    workspaceId: string
  },
  opt?: UseQueryOptions<GetWorkspaceTokensData, GetWorkspaceTokensError>
) =>
  useQuery<GetWorkspaceTokensData, GetWorkspaceTokensError>(
    [args.workspaceId, 'workspace-tokens'],
    () => {
      return getWorkspaceTokens(args)
    },
    opt
  )
