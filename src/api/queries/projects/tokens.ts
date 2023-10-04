import {
  getEnvTokens,
  GetEnvTokensData,
  GetEnvTokensError,
  getWorkspaceTokens,
  GetWorkspaceTokensData,
  GetWorkspaceTokensError,
} from '@/api/requests/tokens'
import { getCliTokens, GetCliTokensData, GetCliTokensError } from '@/api/requests/tokens/cli'
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

export const useGetCliTokens = (
  args: {
    workspaceId: string
  },
  opt?: UseQueryOptions<GetCliTokensData, GetCliTokensError>
) =>
  useQuery<GetCliTokensData, GetCliTokensError>(
    [args.workspaceId, 'cli-tokens'],
    () => {
      return getCliTokens(args.workspaceId)
    },
    opt
  )
